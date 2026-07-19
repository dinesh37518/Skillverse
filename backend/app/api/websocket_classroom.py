import json
import logging
import datetime
import uuid
from typing import Dict, List, Set, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.translation_service import translation_service
from app.services.speech_recognition_service import speech_recognition_service
from app.services.meeting_service import meeting_service
from app.services.attendance_service import attendance_service
from app.services.live_class_service import live_class_service
from app.core.database import SessionLocal

logger = logging.getLogger("websocket_classroom")
router = APIRouter()

# Tracks active connections per live session: session_id -> List[WebSocket]
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Stores client language choices: websocket -> language_string
        self.connection_languages: Dict[WebSocket, str] = {}
        # Stores roles: websocket -> role_string ('educator' or 'student')
        self.connection_roles: Dict[WebSocket, str] = {}
        # Stores user profiles: websocket -> user_id_string
        self.connection_users: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, session_id: str, role: str, language: str, user_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)
        self.connection_languages[websocket] = language
        self.connection_roles[websocket] = role
        self.connection_users[websocket] = user_id
        
        # Log join event in DB (Attendance)
        if role == "student":
            db = SessionLocal()
            try:
                attendance_service.record_join(db, session_id, user_id, language)
            finally:
                db.close()
                
        logger.info(f"New client {user_id} ({role}) connected to live classroom {session_id} in {language}")

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            if websocket in self.active_connections[session_id]:
                self.active_connections[session_id].remove(websocket)
        
        language = self.connection_languages.pop(websocket, "English")
        role = self.connection_roles.pop(websocket, "student")
        user_id = self.connection_users.pop(websocket, None)
        
        # Log leave event in DB (Attendance)
        if role == "student" and user_id:
            db = SessionLocal()
            try:
                attendance_service.record_leave(db, session_id, user_id)
            finally:
                db.close()
                
        logger.info(f"Client {user_id} ({role}) disconnected from live classroom {session_id}")

    async def broadcast_chat(self, session_id: str, sender_name: str, message: str, sender_lang: str):
        connections = self.active_connections.get(session_id, [])
        for ws in connections:
            target_lang = self.connection_languages.get(ws, "English")
            # Translate message specifically for this receiver
            translated_message = translation_service.translate(message, source_lang=sender_lang, target_lang=target_lang)
            
            payload = {
                "type": "chat",
                "sender": sender_name,
                "original_message": message,
                "translated_message": translated_message,
                "language": target_lang
            }
            try:
                await ws.send_text(json.dumps(payload))
            except Exception:
                pass

    async def broadcast_live_subtitles(self, session_id: str, transcript: str, original_lang: str):
        connections = self.active_connections.get(session_id, [])
        for ws in connections:
            target_lang = self.connection_languages.get(ws, "English")
            translated_sub = translation_service.translate(transcript, source_lang=original_lang, target_lang=target_lang)
            
            payload = {
                "type": "subtitles",
                "original_text": transcript,
                "subtitle_text": translated_sub,
                "language": target_lang
            }
            try:
                await ws.send_text(json.dumps(payload))
            except Exception:
                pass

    async def broadcast_raw(self, session_id: str, payload: dict):
        connections = self.active_connections.get(session_id, [])
        for ws in connections:
            try:
                await ws.send_text(json.dumps(payload))
            except Exception:
                pass

    async def send_to_role(self, session_id: str, role: str, payload: dict):
        connections = self.active_connections.get(session_id, [])
        for ws in connections:
            if self.connection_roles.get(ws) == role:
                try:
                    await ws.send_text(json.dumps(payload))
                except Exception:
                    pass

manager = ConnectionManager()

@router.websocket("/ws/classroom/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
    role: str = "student",
    language: str = "English",
    user_id: Optional[str] = None
):
    # If user_id is not passed, create a mock one for testing integrity
    if not user_id:
        user_id = str(uuid.uuid4())
        
    await manager.connect(websocket, session_id, role, language, user_id)
    
    # Broadcast new participant announcement
    await manager.broadcast_raw(session_id, {
        "type": "notification",
        "message": f"A {role} has joined the session."
    })
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            msg_type = message_data.get("type")
            sender_name = message_data.get("sender", "Anonymous")
            
            if msg_type == "chat":
                content = message_data.get("message")
                await manager.broadcast_chat(session_id, sender_name, content, sender_lang=language)
                
            elif msg_type == "audio_chunk" and role == "educator":
                # Handle raw sound chunks for real-time captions translation
                audio_hex = message_data.get("audio_hex", "")
                audio_bytes = bytes.fromhex(audio_hex)
                transcript = speech_recognition_service.transcribe_audio_chunk(audio_bytes)
                if transcript:
                    # Log transcript in DB
                    db = SessionLocal()
                    try:
                        from app.models.models import SessionTranscript
                        db.add(SessionTranscript(session_id=uuid.UUID(session_id), transcript=transcript, original_lang=language))
                        db.commit()
                    except Exception as ex:
                        logger.error(f"Failed to save live transcript chunk: {str(ex)}")
                    finally:
                        db.close()
                        
                    await manager.broadcast_live_subtitles(session_id, transcript, original_lang=language)
                    
            elif msg_type == "text_question":
                # Student asks text doubt in their language
                content = message_data.get("message")
                # Translate to educator's preferred language (e.g. English)
                translated_question = translation_service.translate(content, source_lang=language, target_lang="English")
                await manager.send_to_role(session_id, "educator", {
                    "type": "doubt",
                    "student_id": user_id,
                    "student_name": sender_name,
                    "original_question": content,
                    "translated_question": translated_question,
                    "original_language": language
                })
                
            elif msg_type == "voice_question":
                # Student submits audio doubt chunk
                audio_hex = message_data.get("audio_hex", "")
                audio_bytes = bytes.fromhex(audio_hex)
                # Transcribe question
                transcript = speech_recognition_service.transcribe_audio_chunk(audio_bytes)
                if transcript:
                    detected_lang = speech_recognition_service.detect_spoken_language(audio_bytes)
                    translated_question = translation_service.translate(transcript, source_lang=detected_lang, target_lang="English")
                    await manager.send_to_role(session_id, "educator", {
                        "type": "doubt",
                        "student_id": user_id,
                        "student_name": sender_name,
                        "original_question": transcript,
                        "translated_question": translated_question,
                        "original_language": detected_lang
                    })
                    
            elif msg_type == "educator_reply":
                # Educator answers a student question
                student_id = message_data.get("student_id")
                reply_text = message_data.get("reply")
                
                # Deliver response to student in student preferred language
                for ws in manager.active_connections.get(session_id, []):
                    if manager.connection_users.get(ws) == student_id:
                        student_lang = manager.connection_languages.get(ws, "English")
                        translated_reply = translation_service.translate(reply_text, source_lang="English", target_lang=student_lang)
                        try:
                            await ws.send_text(json.dumps({
                                "type": "doubt_reply",
                                "original_reply": reply_text,
                                "translated_reply": translated_reply,
                                "language": student_lang
                            }))
                        except Exception:
                            pass

            elif msg_type == "ask_ai":
                # Student uses Ask AI Learning Companion
                query = message_data.get("query")
                lang = message_data.get("language", "English")
                
                # Fetch recent transcripts for context matching
                db = SessionLocal()
                context = ""
                try:
                    from app.models.models import SessionTranscript
                    transcripts = db.query(SessionTranscript).filter(
                        SessionTranscript.session_id == uuid.UUID(session_id)
                    ).all()
                    context = " ".join([t.transcript for t in transcripts])
                except Exception:
                    pass
                finally:
                    db.close()
                
                # Ask AI answer doubt using transcription and files context
                from app.services.chatbot import chatbot_service
                ai_reply = chatbot_service.answer_doubt(
                    user_id=user_id,
                    session_id=session_id,
                    message=f"Answer the student question based on this Live Transcript: {context}. Question: {query}",
                    language=lang,
                    student_memory_summary="Preferred style: vocational workshop"
                )
                await websocket.send_text(json.dumps({
                    "type": "ask_ai_reply",
                    "reply": ai_reply
                }))
                
            elif msg_type == "raise_hand":
                active = message_data.get("active", True)
                await manager.broadcast_raw(session_id, {
                    "type": "raise_hand",
                    "student_id": user_id,
                    "student_name": sender_name,
                    "active": active
                })
                
            elif msg_type == "emoji_reaction":
                emoji = message_data.get("emoji")
                await manager.broadcast_raw(session_id, {
                    "type": "emoji_reaction",
                    "student_id": user_id,
                    "student_name": sender_name,
                    "emoji": emoji
                })
                
            elif msg_type == "whiteboard_draw":
                # Draw sync coordinates payload
                draw_data = message_data.get("draw_data")
                meeting_service.record_draw_event(session_id, draw_data)
                # Broadcast coordinate updates to all except drawer
                connections = manager.active_connections.get(session_id, [])
                for ws in connections:
                    if ws != websocket:
                        try:
                            await ws.send_text(json.dumps({
                                "type": "whiteboard_draw",
                                "draw_data": draw_data
                            }))
                        except Exception:
                            pass
                            
            elif msg_type == "whiteboard_clear" and role == "educator":
                meeting_service.clear_whiteboard(session_id)
                await manager.broadcast_raw(session_id, {"type": "whiteboard_clear"})
                
            elif msg_type == "share_file" and role == "educator":
                filename = message_data.get("filename")
                file_url = message_data.get("file_url")
                await manager.broadcast_raw(session_id, {
                    "type": "share_file",
                    "filename": filename,
                    "file_url": file_url
                })
                
            elif msg_type == "poll_create" and role == "educator":
                question = message_data.get("question")
                options = message_data.get("options")
                poll = meeting_service.create_poll(session_id, question, options)
                await manager.broadcast_raw(session_id, {
                    "type": "poll_created",
                    "poll": poll
                })
                
            elif msg_type == "poll_vote":
                poll_id = message_data.get("poll_id")
                option_index = message_data.get("option_index")
                updated_poll = meeting_service.submit_vote(session_id, poll_id, user_id, option_index)
                if updated_poll:
                    await manager.broadcast_raw(session_id, {
                        "type": "poll_updated",
                        "poll": updated_poll
                    })
                    
            elif msg_type == "mute_participant" and role == "educator":
                target_user_id = message_data.get("user_id")
                mute = message_data.get("mute", True)
                # Notify target student connection to mute their mic
                for ws in manager.active_connections.get(session_id, []):
                    if manager.connection_users.get(ws) == target_user_id:
                        try:
                            await ws.send_text(json.dumps({
                                "type": "media_mute_force",
                                "mute": mute
                            }))
                        except Exception:
                            pass
                            
            elif msg_type == "remove_participant" and role == "educator":
                target_user_id = message_data.get("user_id")
                meeting_service.remove_participant(SessionLocal(), session_id, target_user_id)
                # Disconnect websocket for the student
                target_ws = None
                for ws in manager.active_connections.get(session_id, []):
                    if manager.connection_users.get(ws) == target_user_id:
                        target_ws = ws
                        break
                if target_ws:
                    try:
                        await target_ws.send_text(json.dumps({"type": "kicked"}))
                        await target_ws.close()
                    except Exception:
                        pass
                        
            elif msg_type == "media_state":
                media_type = message_data.get("media_type")
                is_on = message_data.get("is_on")
                meeting_service.toggle_media_state(session_id, user_id, media_type, is_on)
                await manager.broadcast_raw(session_id, {
                    "type": "media_state_changed",
                    "user_id": user_id,
                    "media_type": media_type,
                    "is_on": is_on
                })
                
            elif msg_type == "class_control" and role == "educator":
                action = message_data.get("action")  # start, pause, resume, end
                db = SessionLocal()
                try:
                    if action == "end":
                        live_class_service.end_live_class(db, session_id)
                        await manager.broadcast_raw(session_id, {"type": "class_ended"})
                    else:
                        live_class_service.update_class_status(db, session_id, action)
                        await manager.broadcast_raw(session_id, {
                            "type": "class_state_changed",
                            "action": action
                        })
                finally:
                    db.close()
                    
            elif msg_type == "ping":
                # Heartbeat check
                try:
                    await websocket.send_text(json.dumps({"type": "pong"}))
                except Exception:
                    pass

    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        # Notify connection drop
        await manager.broadcast_raw(session_id, {
            "type": "notification",
            "message": f"A user disconnected."
        })
