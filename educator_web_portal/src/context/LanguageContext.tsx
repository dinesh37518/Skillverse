"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Kannada' | 'Bengali' | 'Marathi' | 'Gujarati';

type TranslationDictionary = Record<string, Record<SupportedLanguage, string>>;

const translations: TranslationDictionary = {
  educator_dashboard: {
    English: "Educator Dashboard",
    Hindi: "शिक्षक डैशबोर्ड",
    Tamil: "ஆசிரியர் டாஷ்போர்டு",
    Telugu: "ఉపాధ్యాయ డాష్‌బోర్డ్",
    Kannada: "ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    Bengali: "শিক্ষক ড্যাশবোর্ড",
    Marathi: "शिक्षक डॅशबोर्ड",
    Gujarati: "શિક્ષક ડેશબોર્ડ"
  },
  welcome_title: {
    English: "Welcome to SkillVerse AI",
    Hindi: "SkillVerse AI में आपका स्वागत है",
    Tamil: "SkillVerse AI க்கு வரவேற்கிறோம்",
    Telugu: "SkillVerse AI కి స్వాగతం",
    Kannada: "SkillVerse AI ಗೆ ಸುಸ್ವಾಗತ",
    Bengali: "SkillVerse AI-তে স্বাগতম",
    Marathi: "SkillVerse AI मध्ये आपले स्वागत आहे",
    Gujarati: "SkillVerse AI માં આપનું સ્વાગત છે"
  },
  welcome_sub: {
    English: "Create, manage, and translate vocational courses in real-time. Use the AI suite to generate subtitles, summaries, flashcards, and quizzes instantly.",
    Hindi: "वास्तविक समय में व्यावसायिक पाठ्यक्रमों का निर्माण, प्रबंधन और अनुवाद करें। उपशीर्षक, सारांश और प्रश्नोत्तरी उत्पन्न करने के लिए AI का उपयोग करें।",
    Tamil: "தொழில்முறை படிப்புகளை உருவாக்கவும், நிர்வகிக்கவும் மற்றும் மொழிபெயர்க்கவும். உடனுக்குடன் தலைப்புகள் மற்றும் வினாடி வினாக்களை உருவாக்க AI பயன்படுத்தவும்.",
    Telugu: "రియల్ టైమ్‌లో కోర్సులను సృష్టించండి మరియు అనువదించండి. సారాంశాలు మరియు క్విజ్‌లను రూపొందించడానికి AI ని ఉపయోగించండి.",
    Kannada: "ನೈಜ ಸಮಯದಲ್ಲಿ ವೃತ್ತಿಪರ ಕೋರ್ಸ್‌ಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ಅನುವಾದಿಸಿ. ರಸಪ್ರಶ್ನೆಗಳನ್ನು ರಚಿಸಲು AI ಬಳಸಿ.",
    Bengali: "রিয়েল-টাইমে বৃত্তিমূলক কোর্স তৈরি এবং অনুবাদ করুন। কুইজ তৈরি করতে AI ব্যবহার করুন।",
    Marathi: "रिअल-टाइममध्ये व्यावसायिक अभ्यासक्रम तयार करा आणि अनुवादित करा. प्रश्नमंजुषा तयार करण्यासाठी AI वापरा.",
    Gujarati: "વાસ્તવિક સમયમાં વ્યાવસાયિક અભ્યાસક્રમો બનાવો અને અનુવાદિત કરો. ક્વિઝ બનાવવા માટે AI નો ઉપયોગ કરો."
  },
  quick_create: {
    English: "Quick Create Course",
    Hindi: "त्वरित पाठ्यक्रम बनाएं",
    Tamil: "விரைவு பாடநெறி உருவாக்கம்",
    Telugu: "త్వరిత కోర్సు సృష్టి",
    Kannada: "ತ್ವರಿತ ಕೋರ್ಸ್ ರಚಿಸಿ",
    Bengali: "দ্রুত কোর্স তৈরি করুন",
    Marathi: "झटपट कोर्स तयार करा",
    Gujarati: "ઝડપી કોર્સ બનાવો"
  },
  view_analytics: {
    English: "View Analytics",
    Hindi: "विश्लेषण देखें",
    Tamil: "பகுப்பாய்வுகளைக் காண்க",
    Telugu: "విశ్లేషణలను చూడండి",
    Kannada: "ವಿಶ್ಲೇಷಣೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    Bengali: "বিশ্লেষণ দেখুন",
    Marathi: "विश्लेषणे पहा",
    Gujarati: "વિશ્લેષણ જુઓ"
  },
  total_courses: {
    English: "Total Courses",
    Hindi: "कुल पाठ्यक्रम",
    Tamil: "மொத்த பாடங்கள்",
    Telugu: "మొత్తం కోర్సులు",
    Kannada: "ಒಟ್ಟು ಕೋರ್ಸ್‌ಗಳು",
    Bengali: "মোট কোর্স",
    Marathi: "एकूण अभ्यासक्रम",
    Gujarati: "કુલ અભ્યાસક્રમો"
  },
  students_enrolled: {
    English: "Students Enrolled",
    Hindi: "नामांकित छात्र",
    Tamil: "பதிவுசெய்த மாணவர்கள்",
    Telugu: "చేరిన విద్యార్థులు",
    Kannada: "ನೋಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳು",
    Bengali: "নিবন্ধিত শিক্ষার্থী",
    Marathi: "नोंदणीकृत विद्यार्थी",
    Gujarati: "નોંધાયેલ વિદ્યાર્થીઓ"
  },
  upcoming_live_classes: {
    English: "Upcoming Live Classes",
    Hindi: "आगामी लाइव कक्षाएं",
    Tamil: "வரவிருக்கும் நேரலை வகுப்புகள்",
    Telugu: "రాబోయే లైవ్ క్లాసెస్",
    Kannada: "ಬರುವ ನೇರ ತರಗತಿಗಳು",
    Bengali: "আসন্ন লাইভ ক্লাস",
    Marathi: "आगामी थेट वर्ग",
    Gujarati: "આગામી લાઈવ વર્ગો"
  },
  files_uploaded: {
    English: "Files Uploaded",
    Hindi: "अपलोड की गई फाइलें",
    Tamil: "பதிவேற்றப்பட்ட கோப்புகள்",
    Telugu: "అప్‌లోడ్ చేసిన ఫైళ్లు",
    Kannada: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಫೈಲ್‌ಗಳು",
    Bengali: "আপলোড করা ফাইল",
    Marathi: "अपलोड केलेल्या फायली",
    Gujarati: "અપલોડ કરેલી ફાઇલો"
  },
  daily_motivation: {
    English: "Daily Motivation & Inspiration",
    Hindi: "दैनिक प्रेरणा और विचार",
    Tamil: "தினசரி ஊக்கம் மற்றும் சிந்தனை",
    Telugu: "రోజువారీ ప్రేరణ",
    Kannada: "ದೈನಂದಿನ ಸ್ಫೂರ್ತಿ",
    Bengali: "দৈনিক অনুপ্রেরণা",
    Marathi: "दैनिक प्रेरणा",
    Gujarati: "દૈનિક પ્રેરણા"
  },
  settings: {
    English: "Portal Settings",
    Hindi: "पोर्टल सेटिंग्स",
    Tamil: "அமைப்புகள்",
    Telugu: "సెట్టింగ్‌లు",
    Kannada: "ಸಂಯೋಜನೆಗಳು",
    Bengali: "সেটিংস",
    Marathi: "सेटिंग्ज",
    Gujarati: "સેટિંગ્સ"
  },
  preferred_language: {
    English: "Preferred Language",
    Hindi: "पसंदीदा भाषा",
    Tamil: "விருப்பமான மொழி",
    Telugu: "ఇష్టపడే భాష",
    Kannada: "ಆದ್ಯತೆಯ ಭಾಷೆ",
    Bengali: "பছন্দের ভাষা",
    Marathi: "पसंतीची भाषा",
    Gujarati: "પસંદગીની ભાષા"
  },
  email_verification: {
    English: "Email Code Verification",
    Hindi: "ईमेल कोड सत्यापन",
    Tamil: "மின்னஞ்சல் குறியீடு சரிபார்ப்பு",
    Telugu: "ఈమెయిల్ కోడ్ ధృవీకరణ",
    Kannada: "ಇಮೇಲ್ ಕೋಡ್ ಪರಿಶೀಲನೆ",
    Bengali: "ইমেল কোড যাচাইকরণ",
    Marathi: "ईमेल कोड पडताळणी",
    Gujarati: "ઇમેઇલ કોડ ચકાસણી"
  },
  enter_email: {
    English: "Enter your email address",
    Hindi: "अपना ईमेल पता दर्ज करें",
    Tamil: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
    Telugu: "మీ ఈమెయిల్ నమోదు చేయండి",
    Kannada: "ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ",
    Bengali: "আপনার ইমেল লিখুন",
    Marathi: "तुमचा ईमेल प्रविष्ट करा",
    Gujarati: "તમારું ઇમેઇલ દાખલ કરો"
  },
  send_verification_code: {
    English: "Send Verification Code",
    Hindi: "सत्यापन कोड भेजें",
    Tamil: "சரிபார்ப்புக் குறியீட்டை அனுப்பு",
    Telugu: "కోడ్ పంపండి",
    Kannada: "ಕೋಡ್ ಕಳುಹಿಸಿ",
    Bengali: "কোড পাঠান",
    Marathi: "कोड पाठवा",
    Gujarati: "કોડ મોકલો"
  },
  enter_6_digit_code: {
    English: "Enter 6-digit verification code sent to your email",
    Hindi: "आपके ईमेल पर भेजा गया 6-अंकीय कोड दर्ज करें",
    Tamil: "உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்ட 6 இலக்கக் குறியீட்டை உள்ளிடவும்",
    Telugu: "మీ ఈమెయిల్‌కు పంపిన 6-అంకెల కోడ్‌ను నమోదు చేయండి",
    Kannada: "ನಿಮ್ಮ ಇಮೇಲ್ ಗೆ ಕಳುಹಿಸಲಾದ 6-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ",
    Bengali: "আপনার ইমেলে পাঠানো ৬ ডিজিটের কোডটি লিখুন",
    Marathi: "तुमच्या ईमेलवर पाठवलेला ६ अंकी कोड प्रविष्ट करा",
    Gujarati: "તમારા ઇમેઇલ પર મોકલેલ 6-અંકનો કોડ દાખલ કરો"
  },
  verify_continue: {
    English: "Verify & Continue",
    Hindi: "सत्यापित करें और आगे बढ़ें",
    Tamil: "சரிபார்த்து தொடரவும்",
    Telugu: "ధృవీకరించండి & కొనసాగండి",
    Kannada: "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ",
    Bengali: "যাচাই করুন এবং চালিয়ে যান",
    Marathi: "पडताळणी करा आणि पुढे जा",
    Gujarati: "ચકાસો અને આગળ વધો"
  }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('English');

  useEffect(() => {
    const saved = localStorage.getItem('skillverse_preferred_language') as SupportedLanguage;
    if (saved && ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Marathi', 'Gujarati'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('skillverse_preferred_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    if (translations[key] && translations[key]['English']) {
      return translations[key]['English'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
