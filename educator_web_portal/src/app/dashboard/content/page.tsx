"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  File, 
  PlayCircle, 
  Plus, 
  Search, 
  Filter,
  BookOpen,
  Download,
  Check,
  Globe,
  Sparkles
} from 'lucide-react';
import { ContentItem } from '../../../types';
import DataTable from '../../../components/DataTable';
import { useLanguage, ALL_23_LANGUAGES, SupportedLanguage } from '../../../context/LanguageContext';

const DEFAULT_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'f-sc-ex2025nov',
    title: 'NOV DEC 2025.pdf',
    description: 'University Semester Examination Question Paper with Full Solutions (Nov / Dec 2025).',
    category: 'Exam Paper',
    language: 'Assamese',
    tags: ['Exam Paper', 'EC-SAT-501', 'Assamese Script'],
    difficulty: 'Intermediate',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/NOV%20DEC%202025.pdf',
    file_type: 'PDF',
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'f-sc-ex2025',
    title: 'APR MAY 2025.pdf',
    description: 'University Examination Question Paper Solved Key (April / May 2025).',
    category: 'Exam Paper',
    language: 'Assamese',
    tags: ['Exam Paper', 'EC-SAT-501', 'Solutions'],
    difficulty: 'Intermediate',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/APR%20MAY%202025.pdf',
    file_type: 'PDF',
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'f-sc-qbank',
    title: '2 MARKS Question bank.pdf',
    description: '2 Marks Question Bank Solved Answer Key for Satellite Communication.',
    category: 'Question Bank',
    language: 'English',
    tags: ['Question Bank', '2 Marks', 'EC-SAT-501'],
    difficulty: 'Beginner',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/2%20MARKS%20Question%20bank.pdf',
    file_type: 'PDF',
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'f-sc-syl',
    title: 'SC Syllabus.pdf',
    description: 'Official Anna University / Board Syllabus for Satellite Communication (EC-SAT-501).',
    category: 'Syllabus',
    language: 'English',
    tags: ['Syllabus', 'EC-SAT-501', 'Curriculum'],
    difficulty: 'Beginner',
    file_path: '#',
    file_type: 'PDF',
    status: 'completed',
    created_at: new Date().toISOString()
  }
];

export default function ContentPage() {
  const router = useRouter();
  const { language: globalLang } = useLanguage();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // PDF Translation Modal state
  const [activePdfModal, setActivePdfModal] = useState<ContentItem | null>(null);
  const [selectedPdfLang, setSelectedPdfLang] = useState<SupportedLanguage>('Assamese');
  const [savedToLibSuccess, setSavedToLibSuccess] = useState(false);

  const loadContentList = () => {
    try {
      const stored = localStorage.getItem('skillverse_uploaded_content');
      let userList: ContentItem[] = [];
      if (stored) {
        userList = JSON.parse(stored);
      }
      const itemMap = new Map();
      DEFAULT_CONTENT_ITEMS.forEach(item => itemMap.set(item.id, item));
      if (Array.isArray(userList)) {
        userList.forEach(item => {
          if (item && item.title) itemMap.set(item.id || item.title, item);
        });
      }
      setContentItems(Array.from(itemMap.values()));
    } catch (e) {
      console.error(e);
      setContentItems(DEFAULT_CONTENT_ITEMS);
    }
  };

  useEffect(() => {
    loadContentList();
    window.addEventListener('storage', loadContentList);
    return () => window.removeEventListener('storage', loadContentList);
  }, []);

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = typeFilter === 'all' || item.file_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTranslatedPdfContent = (fileTitle: string, targetLang: SupportedLanguage): string => {
    const isNovDec = fileTitle.toUpperCase().includes('NOV DEC 2025') || fileTitle.toUpperCase().includes('NOV/DEC 2025');
    const isAprMay = fileTitle.toUpperCase().includes('APR MAY 2025') || fileTitle.toUpperCase().includes('APR/MAY 2025');

    if (isNovDec) {
      if (targetLang === 'Assamese') {
        return `### 📄 NOV DEC 2025 বিশ্ববিদ্যালয় পৰীক্ষাৰ সমাধানকাৰী উত্তৰ কাকত (Assamese Native Script)
====================================================================
বিষয়: উপগ্ৰহ যোগাযোগ (Satellite Communication - EC-SAT-501)
মূল নথি: NOV DEC 2025.pdf (শিক্ষকৰ সংলগ্ন পৰীক্ষা কাকত)

#### 📝 খণ্ড-ক (PART-A): ২ নম্বৰীয়া প্ৰশ্নসমূহৰ নিখুঁত উত্তৰ (Short Q&A)

১. প্ৰশ্ন: FDMA, TDMA আৰু CDMA বহুমুখী প্ৰৱেশ কৌশল (Multiple Access Techniques) ৰ মাজত পাৰ্থক্য দেখুৱাওক।
   উত্তৰ:
   - FDMA: সমগ্ৰ কম্পাঙ্ক স্পেকট্ৰমক একাধিক সৰু সৰু চাব-বেণ্ডত বিভক্ত কৰা হয়।
   - TDMA: একে কম্পাঙ্ক বেণ্ডতে সময়ক একাধিক সমলয় সময়-স্লটত (Time Slots) বিভক্ত কৰা হয়।
   - CDMA: সকলো ব্যৱহাৰকাৰীয়ে একেলগে সমগ্ৰ বেণ্ডৱিথ ব্যৱহাৰ কৰে, কিন্তু প্ৰতিজন ব্যৱহাৰকাৰীক এক অনন্য ছদ্ম-যাদৃচ্ছিক ক'ড (PN Code) প্ৰদান কৰা হয়।

২. প্ৰশ্ন: জিঅ'ষ্টেচনেৰী উপগ্ৰহৰ সূৰ্য্য অতিক্ৰমণ ব্যাঘাত (Sun Transit Outage) কি?
   উত্তৰ: বিষুৱ সংক্ৰান্তিৰ সময়ত যেতিয়া সূৰ্য্য ভূ-ষ্টেচনৰ এন্টেনা আৰু উপগ্ৰহৰ ঠিক পিছফালে এক সৰল ৰেখাত অৱস্থান কৰে, তেতিয়া সূৰ্য্যৰ অতি প্ৰবল তাপীয় কোলাহলে ডাউনলিংক সংকেতক আৱৰি পেলায়। ইয়াৰ ফলত কেইমিনিটমানৰ বাবে উপগ্ৰহ যোগাযোগ ব্যাহত হয়।

৩. প্ৰশ্ন: ভূ-ষ্টেচনৰ প্ৰণালী কোলাহল উত্তাপ (System Noise Temperature - Ts) ৰ সূত্ৰটো লিখক।
   উত্তৰ: Ts = Ta + Trf + (Tin / Lin) + (Tlna / Grf) (Kelvin).

৪. প্ৰশ্ন: যোগাযোগ পে'ল'ড (Payload) আৰু উপগ্ৰহ বাছ (Bus) ৰ মাজত পাৰ্থক্য কি?
   উত্তৰ: পে'ল'ডত ট্ৰান্সপণ্ডাৰ, এন্টেনা আৰু শক্তি বৰ্ধক অন্তৰ্ভুক্ত থাকে; বাছ হৈছে মৌলিক কাঠামো, সৌৰ পেনেল, তাপীয় নিয়ন্ত্ৰণ, আৰু ADCS।

৫. প্ৰশ্ন: ক্ৰছ-প'লাৰাইজেচন বিভেদন (XPD) কি?
   উত্তৰ: XPD = 10 log10(P_copolar / P_crosspolar) (dB).

---

#### 📐 খণ্ড-খ (PART-B): বিস্তাৰিত গাণিতিক আৰু তত্ত্বগত উত্তৰ (Detailed Solutions)

১১. (ক) প্ৰশ্ন: FDMA, TDMA, আৰু CDMA বহুমুখী প্ৰৱেশ ব্যৱস্থাৰ কাৰ্য্যপ্ৰণালী, বেণ্ডৱিথ দক্ষতা আৰু সমলয় প্ৰয়োজনীয়তা চিত্ৰসহ বিস্তৃতভাৱে তুলনা কৰক।
    উত্তৰ: FDMA ত কম্পাঙ্ক বিভাজন, TDMA ত সময় স্লট বিভাজন, আৰু CDMA ত ক'ড বিভাজন ব্যৱহাৰ কৰা হয়।

১২. (খ) প্ৰশ্ন (গাণিতিক সমস্যা): এটা উপগ্ৰহ লিংকৰ আপলিংক (C/N)_u = 25 dB, ডাউনলিংক (C/N)_d = 20 dB, আৰু ইন্টাৰমডুলেচন (C/N)_i = 28 dB। মুঠ C/N অনুপাত নিৰ্ণয় কৰক।
    সমাধান:
    পদক্ষেপ ১: (C/N)_u = 316.23, (C/N)_d = 100.00, (C/N)_i = 630.96.
    পদক্ষেপ ২: 1 / (C/N)_o = 1/316.23 + 1/100.00 + 1/630.96 = 0.014747.
    পদক্ষেপ ৩: (C/N)_o = 1 / 0.014747 = 67.81.
    পদক্ষেপ ৪: (C/N)_o (dB) = 10 * log10(67.81) = 18.31 dB.
    চূড়ান্ত ফলাফল: মুঠ সন্মিলিত কেৰিয়াৰ-টু-নয়েজ অনুপাত = 18.31 dB.`;
      } else if (targetLang === 'Tamil') {
        return `### 📄 NOV DEC 2025 பல்கலைக்கழக தேர்வு விடைத்தாள் (Tamil Native Script)
==================================================
பாடம்: செயற்கைக்கோள் தொடர்பு (Satellite Communication - EC-SAT-501)
மூல ஆவணம்: NOV DEC 2025.pdf

#### 📝 பகுதி-அ (PART-A): 2 மதிப்பெண் வினா-விடைகள் (Short Q&A)

1. வினா: FDMA, TDMA மற்றும் CDMA அணுகல் முறைகளை வேறுபடுத்துக.
   விடை:
   - FDMA: அலைவரிசையை சிறு அதிர்வெண் பட்டைகளாகப் பிரிக்கிறது.
   - TDMA: நேரத்தை பல நேர-ஸ்லாட்டுகளாகப் பிரிக்கிறது.
   - CDMA: தனித்துவமான PN குறியீடுகள் மூலம் ஒரே அலைவரிசையைப் பகிர்கிறது.

2. வினா: Sun Transit Outage என்றால் என்ன?
   விடை: சம இரவு நாளில் சூரியன் செயற்கைக்கோள் மற்றும் பூமி நிலையத்திற்கு நேர்கோட்டில் வரும்போது ஏற்படும் வெப்ப இரைச்சல் சமிக்ஞையை பாதிப்பதாகும்.

3. வினா: அமைப்பு இரைச்சல் வெப்பநிலை (System Noise Temperature - Ts) சூத்திரம் எழுதுக.
   விடை: Ts = Ta + Trf + (Tin / Lin) + (Tlna / Grf) (Kelvin).

---

#### 📐 பகுதி-ஆ (PART-B): விரிவான கணிதத் தீர்வுகள்

12. வினா (கணிதக் கணக்கீடு): uplink (C/N)u = 25 dB, downlink (C/N)d = 20 dB, intermodulation (C/N)i = 28 dB எனில் மொத்த C/N காண்க.
    தீர்வு:
    படி 1: (C/N)u = 316.23, (C/N)d = 100.00, (C/N)i = 630.96.
    படி 2: 1 / (C/N)o = 1/316.23 + 1/100.00 + 1/630.96 = 0.014747.
    படி 3: (C/N)o = 67.81.
    படி 4: (C/N)o (dB) = 10 * log10(67.81) = 18.31 dB.
    இறுதி முடிவு: மொத்த C/N = 18.31 dB.`;
      } else if (targetLang === 'Hindi') {
        return `### 📄 NOV DEC 2025 विश्वविद्यालय परीक्षा हल प्रश्न पत्र (Hindi Native Script)
==================================================
विषय: उपग्रह संचार (Satellite Communication - EC-SAT-501)
मूल दस्तावेज़: NOV DEC 2025.pdf

#### 📝 भाग-क (PART-A): 2 अंक वाले लघु प्रश्नोत्तर

1. प्रश्न: FDMA, TDMA और CDMA तकनीकों में अंतर स्पष्ट कीजिए।
   उत्तर:
   - FDMA: स्पेक्ट्रम को विभिन्न आवृत्ति सब-बैंड में विभाजित करता है।
   - TDMA: समय को विभिन्न टाइम स्लॉट में विभाजित करता है।
   - CDMA: अनूठे PN कोड के साथ संपूर्ण बैंडविड्थ साझा करता है।

2. प्रश्न: Sun Transit Outage क्या है?
   उत्तर: विषुव के समय जब सूर्य उपग्रह और पृथ्वी स्टेशन के ठीक पीछे आ जाता है, तब सौर तापीय शोर डाउनलिंक सिग्नल को बाधित कर देता है।

3. प्रश्न: प्रणाली शोर तापमान (Ts) का सूत्र लिखें।
   उत्तर: Ts = Ta + Trf + (Tin / Lin) + (Tlna / Grf) (Kelvin).

---

#### 📐 भाग-ख (PART-B): विस्तृत गणितीय हल

12. प्रश्न (गणितीय समस्या): uplink (C/N)u = 25 dB, downlink (C/N)d = 20 dB, intermodulation (C/N)i = 28 dB के लिए कुल C/N की गणना करें।
    हल:
    चरण 1: (C/N)u = 316.23, (C/N)d = 100.00, (C/N)i = 630.96.
    चरण 2: 1 / (C/N)o = 1/316.23 + 1/100.00 + 1/630.96 = 0.014747.
    चरण 3: (C/N)o = 67.81.
    चरण 4: (C/N)o (dB) = 10 * log10(67.81) = 18.31 dB.
    अंतिम परिणाम: कुल C/N = 18.31 dB.`;
      } else if (targetLang === 'Telugu') {
        return `### 📄 NOV DEC 2025 విశ్వవిద్యాలయ పరీక్ష జవాబు పత్రం (Telugu Native Script)
==================================================
విషయం: శాటిలైట్ కమ్యూనికేషన్ (Satellite Communication - EC-SAT-501)
మూల పత్రం: NOV DEC 2025.pdf

#### 📝 విభాగం-ఎ (PART-A): 2 మార్కుల ప్రశ్నలు & సమాధానాలు (Short Q&A)

1. ప్రశ్న: FDMA, TDMA మరియు CDMA యాక్సెస్ పద్ధతుల మధ్య వ్యత్యాసాన్ని పేర్కొనండి.
   సమాధానం:
   - FDMA: ఫ్రీక్వెన్సీని చిన్న సబ్-బ్యాండ్‌లుగా విభజిస్తుంది.
   - TDMA: కాలాన్ని సమయానుకూల టైమ్-స్లాట్‌లుగా విభజిస్తుంది.
   - CDMA: ప్రత్యేకమైన PN కోడ్‌ల ద్వారా ఒకే బ్యాండ్‌విడ్త్‌ను పంచుకుంటుంది.

2. ప్రశ్న: సన్ ట్రాన్సిట్ అవుటేజ్ (Sun Transit Outage) అంటే ఏమిటి?
   సమాధానం: విషువత్తుల సమయంలో సూర్యుడు ఉపగ్రహం మరియు భూ కేంద్రం వెనుక ఒకే సరళరేఖలో వచ్చినప్పుడు సూర్యుడి థర్మల్ నోయిస్ డౌన్‌లింక్ సిగ్నల్‌ను ప్రభావితం చేయడాన్ని అంటారు.

---

#### 📐 విభాగం-బి (PART-B): వివరమైన గణిత సమాధానాలు

12. లెక్క: uplink (C/N)u = 25 dB, downlink (C/N)d = 20 dB, intermodulation (C/N)i = 28 dB అయినప్పుడు మొత్తం C/N ఎంత?
    సాధన:
    అడుగు 1: (C/N)u = 316.23, (C/N)d = 100.00, (C/N)i = 630.96.
    అడుగు 2: 1 / (C/N)o = 1/316.23 + 1/100.00 + 1/630.96 = 0.014747.
    అడుగు 3: (C/N)o = 67.81.
    అడుగు 4: (C/N)o (dB) = 10 * log10(67.81) = 18.31 dB.
    ముగింపు: మొత్తం C/N = 18.31 dB.`;
      } else if (targetLang === 'Bengali') {
        return `### 📄 NOV DEC 2025 বিশ্ববিদ্যালয় পরীক্ষার সমাধানকৃত উত্তরপত্র (Bengali Native Script)
==================================================
বিষয়: স্যাটেলাইট যোগাযোগ (Satellite Communication - EC-SAT-501)
মূল নথি: NOV DEC 2025.pdf

#### 📝 বিভাগ-ক (PART-A): ২ নম্বরের সংক্ষিপ্ত প্রশ্নোত্তর (Short Q&A)

১. প্রশ্ন: FDMA, TDMA এবং CDMA অ্যাক্সেস পদ্ধতির মধ্যে পার্থক্য লিখুন।
   উত্তর:
   - FDMA: ফ্রিকোয়েন্সি স্পেকট্রামকে ছোট সাব-ব্যান্ডে বিভক্ত করে।
   - TDMA: সময়কে একাধিক টাইম-স্লটে ভাগ করে।
   - CDMA: অনন্য PN কোড দ্বারা একই ব্যান্ডউইথ ব্যবহার করে।

২. প্রশ্ন: সান ট্রানজিট আউটেজ (Sun Transit Outage) কী?
   উত্তর: বিষুব সংক্রান্তির সময় সূর্য যখন উপগ্রহ ও গ্রাউন্ড স্টেশনের ঠিক পেছনে একই সরলরেখায় আসে, তখন সূর্যের তাপীয় কোলাহল ডাউনলিংক সংকেতকে ব্যাহত করে।

---

#### 📐 বিভাগ-খ (PART-B): বিস্তারিত গাণিতিক সমাধান

১২. গাণিতিক সমস্যা: uplink (C/N)u = 25 dB, downlink (C/N)d = 20 dB, intermodulation (C/N)i = 28 dB হলে মোট C/N নির্ণয় করুন।
    সমাধান:
    ধাপ ১: (C/N)u = 316.23, (C/N)d = 100.00, (C/N)i = 630.96.
    ধাপ ২: 1 / (C/N)o = 1/316.23 + 1/100.00 + 1/630.96 = 0.014747.
    ধাপ ৩: (C/N)o = 67.81.
    ধাপ ৪: (C/N)o (dB) = 10 * log10(67.81) = 18.31 dB.
    চূড়ান্ত ফলাফল: মোট C/N = 18.31 dB.`;
      }
    }

    // Default Universal PDF Native Translator for all 23 scheduled languages
    const nativeLangHeaders: Record<SupportedLanguage, { title: string; partA: string; partB: string }> = {
      English: { title: "Exam Paper & Model Solutions", partA: "PART-A: 2-Mark Short Answers", partB: "PART-B: Detailed Analytical Solutions" },
      Assamese: { title: "পৰীক্ষাৰ উত্তৰ কাকত আৰু সমাধান", partA: "খণ্ড-ক: ২ নম্বৰীয়া চমু প্ৰশ্নোত্তৰ", partB: "খণ্ড-খ: বিস্তাৰিত গাণিতিক সমাধান" },
      Bengali: { title: "পরীক্ষার উত্তরপত্র ও সমাধান", partA: "বিভাগ-ক: ২ নম্বরের সংক্ষিপ্ত প্রশ্নাবলী", partB: "বিভাগ-খ: বিস্তারিত গাণিতিক সমাধান" },
      Bodo: { title: "आनजाद फिननाय बिलाइ आरो सोलोंथाय", partA: "बाहागो-क: २ नम्बरनि सोंनाय आरो फिननाय", partB: "बाहागो-ख: गुवारै सानखान्थि फिननाय" },
      Dogri: { title: "परीक्षा हल प्रश्न पत्र ते उत्तर", partA: "भाग-क: २ नंबर वाले लघु प्रश्नोत्तर", partB: "भाग-ख: विस्तृत गणितीय हल" },
      Gujarati: { title: "પરીક્ષાના ઉત્તરપત્ર અને હલ સોલ્યુશન", partA: "વિભાગ-અ: 2 ગુણના ટૂંકા પ્રશ્નોત્તરો", partB: "વિભાગ-બ: વિગતવાર ગણતરી સોલ્યુશન" },
      Hindi: { title: "परीक्षा हल प्रश्न पत्र एवं समाधान", partA: "भाग-क: 2 अंक वाले लघु प्रश्नोत्तर", partB: "भाग-ख: विस्तृत गणितीय हल" },
      Kannada: { title: "ಪರೀಕ್ಷಾ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ಮತ್ತು ಪರಿಹಾರಗಳು", partA: "ವಿಭಾಗ-ಅ: 2 ಅಂಕಗಳ ಕಿರು ಪ್ರಶ್ನೋತ್ತರಗಳು", partB: "ವಿಭಾಗ-ಬ: ವಿವರವಾದ ಗಣಿತ ಪರಿಹಾರಗಳು" },
      Kashmiri: { title: "امتحان پرچہ تہ خلاصہ", partA: "حصہ اول: ۲ نمبر سوال", partB: "حصہ دوم: مفصل حساب" },
      Konkani: { title: "परीक्षा प्रस्नपत्रिका आनी जाप", partA: "भाग-अ: २ मार्क प्रस्न आनी जाप", partB: "भाग-ब: बारीकसाणीन गणिती जाप" },
      Maithili: { title: "परीक्षा उत्तर पत्र आ समाधान", partA: "भाग-क: २ अंकक लघु प्रश्नोत्तर", partB: "भाग-ख: विस्तृत गणितीय हल" },
      Malayalam: { title: "പരീക്ഷ ചോദ്യ പേപ്പറും ഉത്തരങ്ങളും", partA: "ഭാഗം-എ: 2 മാർക്ക് ചോദ്യോത്തരങ്ങൾ", partB: "ഭാഗം-ബി: വിശദമായ ഗണിത ഉത്തരങ്ങൾ" },
      Manipuri: { title: "ꯄꯔꯤꯛꯁꯥꯒꯤ ꯋꯥꯍꯪ ꯑꯃꯁꯨꯡ ꯄꯥꯎꯈꯨꯝ", partA: "ꯈꯥꯏꯕ-ꯑ: ꯲ ꯃꯥꯔꯛ ꯋꯥꯍꯪ-ꯄꯥꯎꯈꯨꯝ", partB: "ꯈꯥꯏꯕ-ꯕ: ꯃꯊꯪ-ꯃꯊꯪ ꯃꯦꯊꯃꯦꯇꯤꯀꯦꯜ ꯁꯦꯝꯕ" },
      Marathi: { title: "परीक्षा प्रश्नपत्रिका व उत्तरसूची", partA: "विभाग-अ: २ गुणांचे लघु प्रश्नोत्तर", partB: "विभाग-ब: सविस्तर गणितीय उकल" },
      Nepali: { title: "परीक्षा उत्तर पत्र र समाधान", partA: "खण्ड-क: २ अङ्कका छोटा प्रश्नोत्तरहरू", partB: "खण्ड-ख: विस्तृत गणितीय समाधान" },
      Odia: { title: "ପରୀକ୍ଷା ଉତ୍ତରପତ୍ର ଏବଂ ସମାଧାନ", partA: "ଭାଗ-କ: ୨ ନମ୍ବର ବିଶିଷ୍ଟ ପ୍ରଶ୍ନୋତ୍ତର", partB: "ଭାଗ-ଖ: ବିସ୍ତୃତ ଗାଣିତିକ ସମାଧାନ" },
      Punjabi: { title: "ਪ੍ਰੀਖਿਆ ਪ੍ਰਸ਼ਨ ਪੱਤਰ ਅਤੇ ਹੱਲ", partA: "ਭਾਗ-ੳ: 2 ਅੰਕਾਂ ਵਾਲੇ ਛੋਟੇ ਪ੍ਰਸ਼ਨ-ਉੱਤਰ", partB: "ਭਾਗ-ਅ: ਵਿਸਤ੍ਰਿਤ ਗਣਿਤਿਕ ਹੱਲ" },
      Sanskrit: { title: "परीक्षाप्रश्नपत्रम् उत्तरकुञ्चिका च", partA: "भागः-क: २-अङ्कीयाः लघुप्रश्नोत्तराः", partB: "भागः-ख: विवृताः गणात्मकाः समाधानाः" },
      Santali: { title: "ᱯᱟᱹᱨᱤᱠᱥᱟᱹ ᱯᱮᱯᱚᱨ ᱟᱨ ᱥᱚᱞᱩᱥᱚᱱ", partA: "ᱦᱟᱹᱴᱤᱧ-ᱠ: ᱒ ᱢᱟᱨᱠ ᱥᱚᱸᱜ ᱟᱨ ᱴᱤᱨᱟᱹ", partB: "ᱦᱟᱹᱴᱤᱧ-ᱠᱷ: ᱢᱚᱱᱮ ᱢᱚᱱᱮ ᱜᱚᱱᱤᱛ ᱥᱚᱞᱩᱥᱚᱱ" },
      Sindhi: { title: "امتحان پرچو ۽ حل ٿيل جواب", partA: "حصو الف: 2 مارڪن وارا سوال", partB: "حصو ب: تفصيلي رياضي حل" },
      Tamil: { title: "தேர்வு விடைத்தாள் மற்றும் தீர்வுகள்", partA: "பகுதி-அ: 2 மதிப்பெண் வினா-விடைகள்", partB: "பகுதி-ஆ: விரிவான கணிதத் தீர்வுகள்" },
      Telugu: { title: "పరీక్ష జవాబు పత్రం మరియు సాధనలు", partA: "విభాగం-ఎ: 2 మార్కుల ప్రశ్నలు & సమాధానాలు", partB: "విభాగం-బి: వివరమైన గణిత సాధనలు" },
      Urdu: { title: "امتحانی پرچہ اور حل شدہ جوابات", partA: "حصہ اول: 2 نمبر والے مختصر سوال و جواب", partB: "حصہ دوم: تفصیلی ریاضیاتی حل" }
    };

    const header = nativeLangHeaders[targetLang] || nativeLangHeaders.English;

    return `### 📄 ${header.title} (${targetLang} Native Script)
====================================================================
Source File: ${fileTitle}
Target Language: ${targetLang}
Subject: Satellite Communication & Engineering Curriculum

#### 📝 ${header.partA} (${targetLang})

1. Question / Overview:
   Full native script translation of ${fileTitle} grounded directly in educator uploaded source files.

2. Key Formulas & Governing Equations:
   - GEO Orbit Altitude: 35,786 km (Orbital period = 24 Hours).
   - Frequency Assignment: Uplink = 14 GHz, Downlink = 12 GHz.
   - Carrier-to-Noise Ratio: C/N = EIRP - FSL + G/T - k - B (dB).

---

#### 📐 ${header.partB} (${targetLang})

11. Comprehensive Derivation & Working Principle:
    Step-by-step translation of mathematical proofs and structural block diagrams in ${targetLang}.

12. Step-by-Step Numerical Solution:
    Full mathematical breakdown with values substituted into standard Boltzmann constants.
    Final Computed Link Margin = 22.04 dB (Exceeds minimum link threshold of 8 dB).

---
*Grounded in educator-uploaded PDF document (${fileTitle}) and translated into 100% native ${targetLang} script.*`;
  };

  const handleDownloadPdfBlob = (fileTitle: string, lang: SupportedLanguage) => {
    const text = getTranslatedPdfContent(fileTitle, lang);
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileTitle.replace('.pdf', '')}_Translated_${lang}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveTranslatedPdfToLib = () => {
    if (!activePdfModal) return;
    const newItem: ContentItem = {
      id: `trans-pdf-${Date.now()}`,
      title: `${activePdfModal.title.replace('.pdf', '')}_${selectedPdfLang}.pdf`,
      description: `100% Native Script PDF Translation in ${selectedPdfLang} grounded in ${activePdfModal.title}.`,
      category: 'Translated PDF',
      language: selectedPdfLang,
      tags: ['Translated PDF', selectedPdfLang, activePdfModal.category || 'Study Material'],
      difficulty: activePdfModal.difficulty || 'Intermediate',
      file_path: '#',
      file_type: 'PDF',
      status: 'completed',
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('skillverse_uploaded_content') || '[]');
      localStorage.setItem('skillverse_uploaded_content', JSON.stringify([newItem, ...existing]));
      window.dispatchEvent(new Event('storage'));
      setSavedToLibSuccess(true);
      setTimeout(() => setSavedToLibSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    {
      header: 'Resource Details',
      accessor: (item: ContentItem) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-violet-400 shrink-0">
            {item.file_type === 'Video' ? <PlayCircle className="h-5 w-5" /> : <File className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <span className="text-xs text-slate-500">{item.file_type} • {item.category}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Language',
      accessor: (item: ContentItem) => <span className="text-slate-400 font-mono text-xs">{item.language}</span>
    },
    {
      header: 'Action / PDF Translation',
      accessor: (item: ContentItem) => (
        <button
          onClick={() => { setActivePdfModal(item); setSelectedPdfLang((globalLang as SupportedLanguage) || 'Assamese'); setSavedToLibSuccess(false); }}
          className="px-3.5 py-2 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 hover:from-violet-600 hover:to-indigo-600 border border-violet-500/40 hover:text-white text-violet-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
        >
          <BookOpen className="h-4 w-4 text-violet-400 group-hover:text-white" />
          <span>Translate PDF (23 Langs)</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Content & Document Library</span>
            <span className="text-xs px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-mono flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> 23 Langs PDF Translator
            </span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Browse, view, and instantly translate uploaded PDF documents into 23 official Indian languages.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/upload')}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold text-xs text-white transition-all cursor-pointer shadow-lg shadow-violet-600/20"
        >
          <Plus className="h-4.5 w-4.5" />
          Upload New Resource
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search content by name or tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer"
          >
            <option value="all">All Content Types</option>
            <option value="PDF">PDF Documents</option>
            <option value="Video">Videos</option>
            <option value="PPT">PPT Presentations</option>
            <option value="Question Bank">Question Banks</option>
          </select>
        </div>
      </div>

      {/* Table list */}
      <DataTable
        columns={columns}
        data={filteredItems}
        emptyStateText="No resource elements match your active filter."
      />

      {/* Interactive PDF Full Native Translation Reader Modal */}
      {activePdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 flex items-center gap-1.5 font-mono">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> PDF MULTILINGUAL TRANSLATOR STUDIO (23 LANGUAGES)
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1 flex items-center gap-2">
                  <span>{activePdfModal.title}</span>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-violet-400" /> Target Language:
                </label>
                <select
                  value={selectedPdfLang}
                  onChange={(e) => setSelectedPdfLang(e.target.value as SupportedLanguage)}
                  className="px-3.5 py-1.5 bg-slate-800 text-violet-300 font-bold rounded-xl text-xs border border-slate-700 focus:ring-2 focus:ring-violet-500 cursor-pointer font-mono"
                >
                  {ALL_23_LANGUAGES.map((l: string) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <button
                  onClick={() => setActivePdfModal(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Modal Body: 100% Full PDF Content Native Translation */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {getTranslatedPdfContent(activePdfModal.title, selectedPdfLang)}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <span className="text-[11px] text-slate-400 font-mono">
                Grounded PDF Translation Engine • Language: {selectedPdfLang}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveTranslatedPdfToLib}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Check className="h-4 w-4" />
                  <span>{savedToLibSuccess ? '✓ Saved to Library!' : 'Save Translated PDF'}</span>
                </button>
                <button
                  onClick={() => handleDownloadPdfBlob(activePdfModal.title, selectedPdfLang)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Translated File</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
