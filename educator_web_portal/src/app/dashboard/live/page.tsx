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
  const [smsNotificationSent, setSmsNotificationSent] = useState(false);
  const [selectedDubbingLang, setSelectedDubbingLang] = useState('Tamil');

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
    },
    {
      id: 'session-2',
      course_id: 'course-2',
      course_title: 'PLC Fundamentals',
      title: 'AC Motor Phase Connections Vetting Q&A',
      scheduled_at: '2026-07-24T10:00:00Z',
      status: 'scheduled',
      webrtc_room_id: 'room-ac-motor-qa',
      join_link: 'http://localhost:3000/live/room-ac-motor-qa',
      created_at: '2026-07-23T08:00:00Z'
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

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-violet-700 hover:bg-violet-50 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Schedule Session
            </button>
            <button
              onClick={handleStartLiveClass}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-extrabold text-sm shadow-md transition-all cursor-pointer animate-pulse"
            >
              <Radio className="h-4 w-4" />
              Go Live Now
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

      {/* Studio View */}
      {activeTab === 'active_studio' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Video Broadcast Stage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 rounded-2xl p-4 shadow-xl text-white relative aspect-video flex flex-col justify-between overflow-hidden border border-slate-800">
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full text-xs font-bold">
                  <Radio className="h-3.5 w-3.5 animate-pulse" />
                  <span>LIVE BROADCASTING</span>
                </div>
                
                {/* Educator Only Permission Badge */}
                <div className="px-3 py-1 bg-violet-950/80 border border-violet-500/30 text-violet-300 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-violet-400" />
                  <span>Educator Exclusive Camera & Screen Control</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Educator Screen Share Toggle Button */}
                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isScreenSharing 
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>{isScreenSharing ? 'Sharing Screen Active' : 'Share Educator Screen'}</span>
                  </button>

                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-slate-300">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{privacyProtectedParticipants.length} Active Students</span>
                  </div>
                </div>
              </div>

              {/* Center Educator Stage / Screen Share View */}
              <div className="text-center space-y-3 my-auto z-10">
                {isScreenSharing ? (
                  <div className="p-6 bg-slate-950/90 border border-emerald-500/40 rounded-2xl max-w-md mx-auto space-y-2">
                    <Monitor className="h-12 w-12 text-emerald-400 mx-auto animate-pulse" />
                    <h4 className="font-bold text-white text-base">Educator Screen & Slide Deck Stream Live</h4>
                    <p className="text-xs text-emerald-300">Broadcasting high-definition presentation screen to all student clients with real-time translation overlays.</p>
                  </div>
                ) : (
                  <>
                    <div className="inline-flex p-4 bg-violet-600/30 text-violet-400 rounded-full border border-violet-500/30">
                      <Mic className="h-10 w-10 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Educator Live Audio/Video Stream Active</h3>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Your speech is being dubbed live into student preferred languages in real time.
                    </p>
                  </>
                )}
              </div>

              {/* Real-time Subtitle Overlay HUD */}
              <div className="z-10 bg-black/75 backdrop-blur-md p-3 rounded-xl border border-violet-500/30 text-center my-2">
                <p className="text-xs font-bold text-violet-300 mb-0.5 flex items-center justify-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-violet-400" />
                  <span>Speech-to-Speech Realtime Dubbing ({selectedDubbingLang})</span>
                </p>
                <p className="text-sm font-semibold text-white">
                  &quot;Verify electrical wiring, pressure valves and circuit breaker clearances before powering on.&quot;
                </p>
              </div>

              {/* Bottom Stream Controls Bar */}
              <div className="flex justify-between items-center z-10 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300">Target Student Language (23 Languages):</span>
                  <select
                    value={selectedDubbingLang}
                    onChange={(e) => setSelectedDubbingLang(e.target.value)}
                    className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs border border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                <button
                  onClick={() => setIsLiveActive(false)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  End Live Stream
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Roster Side Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Participant Roster</h3>
                <p className="text-xs text-slate-500">Student Names & Privacy Protection</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Lock className="h-3 w-3" />
                <span>Phone Numbers Masked</span>
              </div>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {privacyProtectedParticipants.map((student) => (
                <div key={student.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{student.name}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Lock className="h-2.5 w-2.5 text-slate-400" />
                      <span>{student.maskedPhone}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                      {student.lang} Sub & Dub
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
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
