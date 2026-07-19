import logging
import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.models import LiveParticipant, LiveClass

logger = logging.getLogger("meeting_service")

class MeetingService:
    def __init__(self):
        # Maps active session whiteboard states: session_id -> list of drawing events
        self.whiteboard_states: Dict[str, List[Dict[str, Any]]] = {}
        # Maps active session polls: session_id -> list of polls {id, question, options[], votes{option_idx: count}}
        self.active_polls: Dict[str, List[Dict[str, Any]]] = {}

    def initialize_room(self, db: Session, session_id: str) -> str:
        logger.info(f"Initializing WebRTC signaling room for class {session_id}")
        session_uuid = uuid.UUID(session_id) if isinstance(session_id, str) else session_id
        live_class = db.query(LiveClass).filter(LiveClass.id == session_uuid).first()
        if not live_class:
            raise Exception("Live classroom session not found")
        
        if not live_class.webrtc_room_id:
            live_class.webrtc_room_id = f"room-{uuid.uuid4().hex[:12]}"
            db.commit()
            db.refresh(live_class)
            
        return live_class.webrtc_room_id

    def toggle_media_state(self, session_id: str, participant_id: str, media_type: str, is_on: bool) -> Dict[str, Any]:
        """
        Logs toggle of educator/student camera, mic, or screen sharing.
        media_type can be 'camera', 'microphone', or 'screen'.
        """
        logger.info(f"Session {session_id}: Participant {participant_id} turned {media_type} {'ON' if is_on else 'OFF'}")
        return {
            "session_id": session_id,
            "participant_id": participant_id,
            "media_type": media_type,
            "status": "enabled" if is_on else "disabled"
        }

    def record_draw_event(self, session_id: str, draw_event: Dict[str, Any]):
        """
        Appends a whiteboard drawing coordinate/line coordinate.
        """
        if session_id not in self.whiteboard_states:
            self.whiteboard_states[session_id] = []
        self.whiteboard_states[session_id].append(draw_event)

    def get_whiteboard_state(self, session_id: str) -> List[Dict[str, Any]]:
        return self.whiteboard_states.get(session_id, [])

    def clear_whiteboard(self, session_id: str):
        if session_id in self.whiteboard_states:
            self.whiteboard_states[session_id] = []
            logger.info(f"Whiteboard cleared for session {session_id}")

    def create_poll(self, session_id: str, question: str, options: List[str]) -> Dict[str, Any]:
        logger.info(f"Creating poll in session {session_id}: {question}")
        poll_id = f"poll-{uuid.uuid4().hex[:8]}"
        poll = {
            "id": poll_id,
            "question": question,
            "options": options,
            "votes": {i: 0 for i in range(len(options))},
            "voters": []
        }
        if session_id not in self.active_polls:
            self.active_polls[session_id] = []
        self.active_polls[session_id].append(poll)
        return poll

    def submit_vote(self, session_id: str, poll_id: str, voter_id: str, option_index: int) -> Optional[Dict[str, Any]]:
        polls = self.active_polls.get(session_id, [])
        for p in polls:
            if p["id"] == poll_id:
                if voter_id in p["voters"]:
                    logger.warning(f"Voter {voter_id} already voted on poll {poll_id}")
                    return p
                p["voters"].append(voter_id)
                idx = str(option_index)
                if idx not in p["votes"] and option_index in p["votes"]:
                    p["votes"][option_index] += 1
                else:
                    p["votes"][idx] = p["votes"].get(idx, 0) + 1
                return p
        return None

    def get_polls(self, session_id: str) -> List[Dict[str, Any]]:
        return self.active_polls.get(session_id, [])

    def mute_participant(self, db: Session, session_id: str, user_id: str, mute: bool) -> Dict[str, Any]:
        logger.info(f"Muting participant {user_id} in session {session_id}: {mute}")
        return {
            "session_id": session_id,
            "user_id": user_id,
            "muted": mute
        }

    def remove_participant(self, db: Session, session_id: str, user_id: str) -> bool:
        logger.info(f"Removing/Kicking participant {user_id} from session {session_id}")
        session_uuid = uuid.UUID(session_id) if isinstance(session_id, str) else session_id
        user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
        
        participant = db.query(LiveParticipant).filter(
            LiveParticipant.session_id == session_uuid,
            LiveParticipant.user_id == user_uuid,
            LiveParticipant.left_at.is_(None)
        ).first()
        
        if participant:
            import datetime
            participant.left_at = datetime.datetime.utcnow()
            db.commit()
            return True
        return False

meeting_service = MeetingService()
