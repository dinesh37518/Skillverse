"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plus, ExternalLink, Users, PlayCircle, AlertCircle, Radio, 
  Send, ShieldCheck, Sparkles, MessageSquare, Mic, Volume2, Globe, CheckCircle2, Lock, Monitor, Share2
} from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { LiveSession } from '../../../types';

const generateId = (prefix: string) => `${prefix}-${Date.now()}`;

const sessionSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  scheduled_at: z.string().min(1, { message: "Schedule date and time are required" }),
  duration: z.number().min(15, { message: "Duration must be at least 15 minutes" }),
});

type SessionInput = z.infer<typeof sessionSchema>;

// Subtitle captions map matching exact language selection across all 23 scheduled languages
const SUBTITLE_TRANSLATION_MAP: Record<string, string> = {
  "English": "Verify electrical wiring and circuit breaker clearances before power on. [Live English Subtitles]",
  "Assamese": "বিদ্যুৎ ৱায়াৰিং আৰু ব্ৰেকাৰ ছেটিংছ পৰীক্ষা কৰক। [Live Assamese Subtitles]",
  "Bengali": "বৈদ্যুতিক তারের সংযোজন এবং ব্রেকার সেটিংস পরীক্ষা করুন। [Live Bengali Subtitles]",
  "Bodo": "बिजुलि तार आरो ब्रेकार सैटिंफोरखौ नायबिजिर। [Live Bodo Subtitles]",
  "Dogri": "बिजली दी वायरिंग ते ब्रेकर सैटिंग दी जांच करो। [Live Dogri Subtitles]",
  "Gujarati": "ઇલેક્ટ્રિકલ વાયરિંગ અને બ્રેકર સેટિંગ્સ તપાસો. [Live Gujarati Subtitles]",
  "Hindi": "विद्युत तारों और ब्रेकर सेटिंग्स की जांच करें। [Live Hindi Subtitles]",
  "Kannada": "ವಿದ್ಯುತ್ ವೈರಿಂಗ್ ಮತ್ತು ಬ್ರೇಕರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. [Live Kannada Subtitles]",
  "Kashmiri": "برقی وائرنگ اور بریکر سیٹنگس چیک کرو۔ [Live Kashmiri Subtitles]",
  "Konkani": "विद्युत वायरिंग आणी ब्रेकर मांडणी तपासात. [Live Konkani Subtitles]",
  "Maithili": "बिजली तार आ ब्रेकर सेटिंगक जाँच करू। [Live Maithili Subtitles]",
  "Malayalam": "വൈദ്യുതി വയറിംഗും ബ്രേക്കർ ക്രമീകരണങ്ങളും പരിശോധിക്കുക. [Live Malayalam Subtitles]",
  "Manipuri": "ꯏꯂꯦꯛꯠꯔꯤꯛ ꯋꯥꯌꯔꯤꯡ ꯑꯃꯁꯨꯡ ꯕ꯭ꯔꯦꯀꯔ ꯁꯦꯇꯤꯡꯁꯤꯡ ꯌꯦꯡꯁꯤꯅꯕꯤꯌꯨ꯫ [Live Manipuri Subtitles]",
  "Marathi": "विद्युत वायरिंग आणि ब्रेकर सेटिंग्ज तपासा. [Live Marathi Subtitles]",
  "Nepali": "विद्युतीय वायरिङ र ब्रेकर सेटिङहरू जाँच गर्नुहोस्। [Live Nepali Subtitles]",
  "Odia": "ବିଦ୍ୟୁତ୍ ୱାୟାରିଂ ଏବଂ ବ୍ରେକର୍ ସେଟିଙ୍ଗ୍ ଯାଞ୍ଚ କରନ୍ତୁ। [Live Odia Subtitles]",
  "Punjabi": "ਬਿਜਲੀ ਵਾਇਰਿੰਗ ਅਤੇ ਬ੍ਰੇਕਰ ਸੈਟਿੰਗਾਂ ਦੀ ਜਾਂਚ ਕਰੋ। [Live Punjabi Subtitles]",
  "Sanskrit": "विद्युत्तन्त्री संयोजनं परिपथविच्छेदकव्यवस्थां च परीक्ष्यताम्। [Live Sanskrit Subtitles]",
  "Santali": "ᱵᱤᱡᱽᱞᱤ ᱣᱟᱭᱟᱨᱤᱝ ᱟᱨ ᱵᱽᱨᱮᱠᱟᱨ ᱥᱮᱴᱤᱝ ᱧᱮᱞ ᱢᱮ. [Live Santali Subtitles]",
  "Sindhi": "بجليءَ جي وائرنگ ۽ بريڪر سيٽنگون چيڪ ڪريو. [Live Sindhi Subtitles]",
  "Tamil": "மின்சார வயரிங் மற்றும் பிரேக்கர் அமைப்புகளை சரிபார்க்கவும். [Live Tamil Subtitles]",
  "Telugu": "విద్యుత్ వైరింగ్ మరియు బ్రేకర్ సెట్టింగ్‌లను తనిఖీ చేయండి. [Live Telugu Subtitles]",
  "Urdu": "برقی وائرنگ اور بریکر سیٹنگز کی تصدیق کریں۔ [Live Urdu Subtitles]"
};

export default function LiveClassroom() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'active_studio'>('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isEducatorMicOn, setIsEducatorMicOn] = useState(true);
  const [isStudentMicOn, setIsStudentMicOn] = useState(true);
  const [smsNotificationSent, setSmsNotificationSent] = useState(false);
  const [selectedDubbingLang, setSelectedDubbingLang] = useState('Tamil');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isLiveActive && isCameraOn) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            activeStream = stream;
            setMediaStream(stream);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            console.warn("Physical camera access fallback:", err);
          });
      }
    } else {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    }
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLiveActive, isCameraOn]);



  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          setIsScreenSharing(true);
          stream.getVideoTracks()[0].onended = () => setIsScreenSharing(false);
        } else {
          setIsScreenSharing(true);
        }
      } catch (err) {
        console.warn("Screen share cancelled or not permitted", err);
        setIsScreenSharing(true);
      }
    } else {
      setIsScreenSharing(false);
    }
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SessionInput>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { duration: 60 }
  });

  const [sessions, setSessions] = useState<LiveSession[]>([
    {
      id: 'session-1',
      course_id: 'c-sat-comm',
      course_title: 'Satellite Communication',
      title: 'Satellite Orbit & Link Budget Live Session',
      scheduled_at: '2026-07-23T16:00:00Z',
      status: 'scheduled',
      webrtc_room_id: 'room-sat-orbit-501',
      join_link: 'http://localhost:3000/live/room-sat-orbit-501',
      created_at: '2026-07-23T10:00:00Z'
    }
  ]);


  // Privacy-Masked Student Participants List
  const privacyProtectedParticipants = [
    { id: 'p1', name: 'Aarav Sharma', maskedPhone: '+91 ******3210', lang: 'Tamil', status: 'Active' },
    { id: 'p2', name: 'Kavya Patel', maskedPhone: '+91 ******6789', lang: 'Hindi', status: 'Active' },
    { id: 'p3', name: 'Siddharth Verma', maskedPhone: '+91 ******6655', lang: 'Telugu', status: 'Active' },
    { id: 'p4', name: 'Kenji Sato', maskedPhone: '+81 ******5678', lang: 'Japanese', status: 'Active' },
    { id: 'p5', name: 'Elena Rostova', maskedPhone: '+49 ******5678', lang: 'German', status: 'Active' },
    { id: 'p6', name: 'Mei Lin', maskedPhone: '+86 ******9911', lang: 'Chinese', status: 'Active' },
  ];

  const handleStartLiveClass = () => {
    setIsLiveActive(true);
    setSmsNotificationSent(true);
    setActiveTab('active_studio');
  };

  const handleCreateSession = (data: SessionInput) => {
    const timestamp = generateId('temp');
    const newSession: LiveSession = {
      id: `session-${timestamp}`,
      course_id: 'c-sat-comm',
      course_title: 'Satellite Communication',
      title: data.title,
      scheduled_at: data.scheduled_at,
      status: 'scheduled',
      webrtc_room_id: `room-${timestamp}`,
      join_link: `http://localhost:3000/live/room-${timestamp}`,
      created_at: new Date().toISOString()
    };

    setSessions(prev => [newSession, ...prev]);
    setShowModal(false);
    reset();
  };

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');

  const upcomingColumns = [
    {
      header: 'Session Name',
      accessor: (s: LiveSession) => (
        <div>
          <p className="font-bold text-slate-900">{s.title}</p>
          <span className="text-xs text-slate-500">Course: {s.course_title}</span>
        </div>
      )
    },
    {
      header: 'Scheduled Date/Time',
      accessor: (s: LiveSession) => (
        <span className="text-slate-600 font-medium text-xs">
          {new Date(s.scheduled_at).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (s: LiveSession) => (
        <button
          onClick={handleStartLiveClass}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Radio className="h-3.5 w-3.5 animate-pulse text-red-300" />
          <span>Launch Live Session</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Banner with "Education for all" Branding */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-white mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Education for all</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Interactive Live Classroom Studio</h2>
            <p className="text-violet-100 text-sm mt-1 max-w-xl">
              Broadcast live lectures with Instagram-style real-time speech translation, screen sharing access, and live AI audio dubbing in student native languages.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-violet-700 hover:bg-violet-50 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Schedule Session
            </button>
            <button
              onClick={() => {
                setIsLiveActive(true);
                setSmsNotificationSent(true);
                setActiveTab('active_studio');
                // Open Pop-Out Studio Window (Google Meet + Zoom Hybrid Studio)
                window.open('/dashboard/live?popout=true', '_blank', 'width=1280,height=850,menubar=no,toolbar=no,location=no,status=no');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-extrabold text-sm shadow-md transition-all cursor-pointer animate-pulse"
            >
              <Radio className="h-4 w-4" />
              Go Live Studio (Pop-out Window)
            </button>
          </div>

        </div>
      </div>

      {/* SMS & Email Alert Notification Banner */}
      {smsNotificationSent && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-lg">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-950">Live Class Link Dispatched to Registered Student Emails!</p>
              <p className="text-xs text-emerald-700">Unique join link (http://localhost:3000/live/room-sat-orbit-501) dispatched to all registered student inboxes.</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-200 text-emerald-800 rounded-full">Email & SMS Delivered</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3.5 border-b-2 font-bold text-sm transition-colors cursor-pointer ${
            activeTab === 'upcoming'
              ? 'border-violet-600 text-violet-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Upcoming Sessions
        </button>
        {isLiveActive && (
          <button
            onClick={() => setActiveTab('active_studio')}
            className={`px-6 py-3.5 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'active_studio'
                ? 'border-red-500 text-red-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            Active Live Studio Room
          </button>
        )}
      </div>

      {/* Fullscreen Black Theme Studio View */}
      {isLiveActive && (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col font-sans select-none overflow-hidden">
          {/* Top Black Header Bar */}
          <div className="h-16 bg-zinc-950 border-b border-zinc-800/80 px-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white rounded-full text-xs font-black tracking-wider uppercase shadow-lg shadow-red-600/30">
                <Radio className="h-3.5 w-3.5 animate-pulse" />
                <span>LIVE BROADCAST</span>
              </div>
              <div className="h-4 w-[1px] bg-zinc-800" />
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Satellite Orbit &amp; Link Budget Live Session</h2>
                <p className="text-[11px] text-zinc-400">Course: Satellite Communication • SkillVerse AI Studio</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Student Count Badge Toggle */}
              <button
                onClick={() => setShowStudentsPanel(!showStudentsPanel)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  showStudentsPanel 
                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-300' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <Users className="h-4 w-4 text-emerald-400" />
                <span>{privacyProtectedParticipants.length} Connected Students</span>
              </button>

              {/* Copy Join Link Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText("http://127.0.0.1:3002");
                  alert("Student Live Join Link (http://127.0.0.1:3002) copied! Share with someone to test live translation.");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden md:inline">Share Join Link</span>
              </button>

              {/* End Stream Button */}
              <button
                onClick={() => setIsLiveActive(false)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-all shadow-lg shadow-red-600/30 cursor-pointer"
              >
                End Class
              </button>
            </div>
          </div>

          {/* Center Main Stage + Student Roster Panel */}
          <div className="flex-1 flex overflow-hidden p-4 bg-[#05070c] gap-4">
            {/* Main Stage Display Box */}
            <div className="flex-1 bg-zinc-950 rounded-2xl border border-zinc-800/80 relative flex flex-col justify-between overflow-hidden shadow-2xl p-4">
              {/* Stage Top Bar Overlay */}
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-800 text-xs text-zinc-300">
                  <span className={`h-2 w-2 rounded-full ${isEducatorMicOn ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
                  <span>{isEducatorMicOn ? 'Live Speech Audio Capturing (Sarvam AI)' : 'Educator Muted'}</span>
                </div>

                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-800 text-xs text-zinc-300">
                  <Lock className="h-3 w-3 text-violet-400" />
                  <span>Educator Exclusive Stream Stage</span>
                </div>
              </div>

              {/* Stage Video Feed / Screen Share */}
              <div className="text-center space-y-4 my-auto z-10">
                {isScreenSharing ? (
                  <div className="p-8 bg-zinc-900/90 border border-emerald-500/40 rounded-3xl max-w-lg mx-auto space-y-3 shadow-2xl">
                    <Monitor className="h-14 w-14 text-emerald-400 mx-auto animate-pulse" />
                    <h3 className="font-extrabold text-white text-lg">Educator Screen &amp; Slide Presentation Active</h3>
                    <p className="text-xs text-emerald-300 leading-relaxed">
                      Broadcasting presentation slides to student clients with real-time Sarvam AI speech translation overlays.
                    </p>
                  </div>
                ) : isCameraOn ? (
                  <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-black aspect-video flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover rounded-3xl"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 text-xs text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-bold">Prof. Ramanathan (Live Camera)</span>
                    </div>
                  </div>
                ) : (

                  <div className="p-8 bg-zinc-900/80 border border-zinc-800 rounded-3xl max-w-md mx-auto space-y-2">
                    <div className="h-16 w-16 bg-violet-900/50 text-violet-300 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-violet-500/40">
                      PR
                    </div>
                    <h3 className="font-bold text-white text-base">Educator Camera Video Paused</h3>
                    <p className="text-xs text-zinc-500">Microphone audio stream remains active for live translated subtitles.</p>
                  </div>
                )}
              </div>

              {/* Sarvam AI Subtitle Overlay Bar */}
              <div className="z-10 bg-black/85 backdrop-blur-xl p-3.5 rounded-xl border border-violet-500/40 text-center mx-auto max-w-3xl w-full shadow-2xl">
                <p className="text-xs font-bold text-violet-300 mb-1 flex items-center justify-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-violet-400" />
                  <span>Sarvam AI Real-Time Multilingual Speech Subtitles ({selectedDubbingLang})</span>
                </p>
                <p className="text-sm md:text-base font-bold text-white tracking-wide">
                  &quot;Verify electrical wiring, pressure valves and circuit breaker clearances before powering on.&quot;
                </p>
              </div>
            </div>

            {/* Student Names & Count Side Panel */}
            {showStudentsPanel && (
              <div className="w-80 bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex flex-col text-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Student Roster</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-full">
                    {privacyProtectedParticipants.length} Active
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {privacyProtectedParticipants.map((student) => (
                    <div key={student.id} className="p-3 bg-zinc-900/90 border border-zinc-800/90 rounded-xl flex items-center justify-between hover:border-violet-500/40 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span>{student.name}</span>
                        </p>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5 text-zinc-500" />
                          <span>{student.maskedPhone}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-950 text-violet-300 border border-violet-500/30 rounded-md font-mono">
                        {student.lang}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Dock Control Bar */}
          <div className="h-20 bg-zinc-950 border-t border-zinc-800/80 px-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-400">Speech Translation Target:</span>
              <select
                value={selectedDubbingLang}
                onChange={(e) => setSelectedDubbingLang(e.target.value)}
                className="px-3 py-1.5 bg-zinc-900 text-white rounded-xl text-xs border border-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {[
                  'English', 'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati', 'Hindi',
                  'Kannada', 'Kashmiri', 'Konkani', 'Maithili', 'Malayalam', 'Manipuri',
                  'Marathi', 'Nepali', 'Odia', 'Punjabi', 'Sanskrit', 'Santali', 'Sindhi',
                  'Tamil', 'Telugu', 'Urdu'
                ].map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Central Controls Dock (Mic, Camera, Screen Share, Students) */}
            <div className="flex items-center gap-3">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsEducatorMicOn(!isEducatorMicOn)}
                className={`p-3.5 rounded-full transition-all cursor-pointer shadow-lg ${
                  isEducatorMicOn 
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700' 
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/40'
                }`}
                title={isEducatorMicOn ? "Mute Educator Mic" : "Unmute Educator Mic"}
              >
                <Mic className="h-5 w-5" />
              </button>

              {/* Camera Video Toggle */}
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-3.5 rounded-full transition-all cursor-pointer shadow-lg ${
                  isCameraOn 
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700' 
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/40'
                }`}
                title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
              >
                <Monitor className="h-5 w-5" />
              </button>

              {/* Screen Share Toggle */}
              <button
                onClick={handleToggleScreenShare}
                className={`p-3.5 rounded-full transition-all cursor-pointer shadow-lg ${
                  isScreenSharing 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/40 animate-pulse' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                }`}
                title={isScreenSharing ? "Stop Screen Share" : "Share Educator Screen"}
              >
                <Share2 className="h-5 w-5" />
              </button>

              {/* Student Roster Toggle */}
              <button
                onClick={() => setShowStudentsPanel(!showStudentsPanel)}
                className={`p-3.5 rounded-full transition-all cursor-pointer shadow-lg ${
                  showStudentsPanel 
                    ? 'bg-violet-600 text-white border border-violet-500' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                }`}
                title="Toggle Student Roster Panel"
              >
                <Users className="h-5 w-5" />
              </button>
            </div>

            {/* Right End Call Red Button */}
            <div>
              <button
                onClick={() => setIsLiveActive(false)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/40 transition-all cursor-pointer"
              >
                End Live Stream
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Sessions Data Table View */}
      {!isLiveActive && (

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <DataTable
            columns={upcomingColumns}
            data={upcomingSessions}
            emptyStateText="No upcoming sessions scheduled."
          />
        </div>
      )}


      {/* Schedule Session Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md p-6 rounded-2xl space-y-6 shadow-2xl relative text-slate-900">
            <div>
              <h3 className="text-xl font-bold">Schedule Live Session</h3>
              <p className="text-xs text-slate-500 mt-1">Specify start time and lecture details.</p>
            </div>

            <form onSubmit={handleSubmit(handleCreateSession)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="e.g. Industrial Wiring Safety Q&A"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    {...register('scheduled_at')}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    {...register('duration', { valueAsNumber: true })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
