"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 
  | 'English' | 'Assamese' | 'Bengali' | 'Bodo' | 'Dogri' | 'Gujarati' 
  | 'Hindi' | 'Kannada' | 'Kashmiri' | 'Konkani' | 'Maithili' | 'Malayalam' 
  | 'Manipuri' | 'Marathi' | 'Nepali' | 'Odia' | 'Punjabi' | 'Sanskrit' 
  | 'Santali' | 'Sindhi' | 'Tamil' | 'Telugu' | 'Urdu';

export const ALL_23_LANGUAGES: SupportedLanguage[] = [
  'English', 'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati', 
  'Hindi', 'Kannada', 'Kashmiri', 'Konkani', 'Maithili', 'Malayalam', 
  'Manipuri', 'Marathi', 'Nepali', 'Odia', 'Punjabi', 'Sanskrit', 
  'Santali', 'Sindhi', 'Tamil', 'Telugu', 'Urdu'
];

type TranslationDictionary = Record<string, Partial<Record<SupportedLanguage, string>>>;

const translations: TranslationDictionary = {
  // Navigation items & core UI keys translated across all 23 scheduled languages
  Dashboard: {
    English: "Dashboard", Tamil: "டாஷ்போர்டு", Hindi: "डैशबोर्ड", Telugu: "డాష్‌బోర్డ్",
    Assamese: "ডেচবৰ্ড", Bengali: "ড্যাশবোর্ড", Bodo: "ड्यासबोर्ड", Dogri: "डैशबोर्ड", Gujarati: "ડેશબોર્ડ",
    Kannada: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", Kashmiri: "ڈیش بورڈ", Konkani: "डॅशबोर्ड", Maithili: "डैशबोर्ड", Malayalam: "ഡാഷ്‌ബോർഡ്",
    Manipuri: "ꯗꯦꯁꯕꯣꯔꯗ", Marathi: "डॅशबोर्ड", Nepali: "ड्यासबोर्ड", Odia: "ଡ୍ୟାସବୋର୍ଡ", Punjabi: "ਡੈਸ਼ਬੋਰਡ",
    Sanskrit: "फलकम्", Santali: "ᱰᱮᱥ workspace", Sindhi: "ڊئش بورڊ", Urdu: "ڈیش بورڈ"
  },
  Courses: {
    English: "Courses", Tamil: "பாடநெறிகள்", Hindi: "पाठ्यक्रम", Telugu: "కోర్సులు",
    Assamese: "পাঠ্যক্ৰম", Bengali: "পাঠ্যক্রম", Bodo: "आयदाफोर", Dogri: "कोर्स", Gujarati: "કોર્સિસ",
    Kannada: "ಕೋರ್ಸ್‌ಗಳು", Kashmiri: "کورس", Konkani: "कोर्स", Maithili: "पाठ्यक्रम", Malayalam: "കോഴ്സുകൾ",
    Manipuri: "ꯀꯣꯔꯁꯁꯤꯡ", Marathi: "अभ्यासक्रम", Nepali: "पाठ्यक्रमहरू", Odia: "ପାଠ୍ୟକ୍ରମ", Punjabi: "ਕੋਰਸ",
    Sanskrit: "पाठ्यक्रमः", Santali: "<ctrl42>ᱳᱨᱥ", Sindhi: "ڪورس", Urdu: "کورسز"
  },
  "Content Library": {
    English: "Content Library", Tamil: "பாடக் களஞ்சியம்", Hindi: "सामग्री पुस्तकालय", Telugu: "కంటెంట్ లైబ్రరీ",
    Assamese: "সামগ্ৰী পুথিভঁৰাল", Bengali: "কন্টেন্ট লাইব্রেরি", Bodo: "आयदा लायब्रेरी", Dogri: "सामग्री पुस्तकालय", Gujarati: "સાધનો મંડળ",
    Kannada: "ವಿಷಯ ಗ್ರಂಥಾಲಯ", Kashmiri: "مواد لایبریری", Konkani: "सामग्री लायब्ररी", Maithili: "सामग्री पुस्तकालय", Malayalam: "കണ്ടന്റ് ലൈബ്രറി",
    Manipuri: "ꯀꯟꯇꯦꯟꯠ ꯂꯥꯏꯕ꯭ꯔꯦꯔꯤ", Marathi: "सामग्री ग्रंथालय", Nepali: "सामग्री पुस्तकालय", Odia: "ବିଷୟବସ୍ତୁ ପାଠାଗାର", Punjabi: "ਸਮੱਗਰੀ ਲਾਇਬ੍ਰੇਰੀ",
    Sanskrit: "विषयपुस्तकालयः", Santali: "ᱠᱚᱱᱴᱮᱱᱴ", Sindhi: "مواد لائبريري", Urdu: "مواد کی لائبریری"
  },
  "Upload Center": {
    English: "Upload Center", Tamil: "பதிவேற்ற மையம்", Hindi: "अपलोड केंद्र", Telugu: "అప్‌లోడ్ కేంద్రం",
    Assamese: "আপলোড কেন্দ্ৰ", Bengali: "আপলোড সেন্টার", Bodo: "अपलोड सेंटर", Dogri: "अपलोड केंद्र", Gujarati: "અપલોડ સેન્ટર",
    Kannada: "ಅಪ್‌ಲೋಡ್ ಕೇಂದ್ರ", Kashmiri: "اپلوڈ سینٹر", Konkani: "अपलोड केंद्र", Maithili: "अपलोड केंद्र", Malayalam: "അപ്‌ലോഡ് സെന്റർ",
    Manipuri: "ꯑꯞꯂꯣꯗ ꯁꯦꯟꯇꯔ", Marathi: "अपलोड केंद्र", Nepali: "अपलोड केन्द्र", Odia: "ଅପଲୋଡ୍ କେନ୍ଦ୍ର", Punjabi: "ਅੱਪਲੋਡ ਕੇਂਦਰ",
    Sanskrit: "आरोपणकेन्द्रम्", Santali: "ᱟᱯᱞᱳᱰ ᱥᱮᱱᱴᱚᱨ", Sindhi: "اپلوڊ سينٽر", Urdu: "اپ لوڈ سینٹر"
  },
  "Live Classes": {
    English: "Live Classes", Tamil: "நேரலை வகுப்புகள்", Hindi: "लाइव कक्षाएं", Telugu: "లైవ్ క్లాసెస్",
    Assamese: "লাইভ শ্ৰেণী", Bengali: "লাইভ ক্লাস", Bodo: "लाइभ क्लास", Dogri: "लाइव कक्षां", Gujarati: "લાઇવ વર્ગો",
    Kannada: "ಲೈವ್ ತರಗತಿಗಳು", Kashmiri: "لائیو کلاسز", Konkani: "लाइव्ह क्लासीस", Maithili: "लाइव क्लास", Malayalam: "ലൈവ് ക്ലാസുകൾ",
    Manipuri: "ꯂꯥꯏ꯭ꯚ ꯀ꯭ꯂꯥꯁ", Marathi: "थेट वर्ग", Nepali: "लाइभ कक्षा", Odia: "ଲାଇଭ୍ କ୍ଲାସ୍", Punjabi: "ਲਾਈਵ ਕਲਾਸਾਂ",
    Sanskrit: "प्रत्यक्षवर्गः", Santali: "ᱞᱟive ᱠᱞᱟᱥ", Sindhi: "لائيو ڪلاسون", Urdu: "لائیو کلاسز"
  },
  Assignments: {
    English: "Assignments", Tamil: "பயிற்சிகள்", Hindi: "असाइनमेंट", Telugu: "అసైన్‌మెంట్లు",
    Assamese: "অ্যাসাইনমেন্ট", Bengali: "অ্যাসাইনমেন্ট", Bodo: "असाइनमेन्ट", Dogri: "असाइनमेंट", Gujarati: "એસાાઇનમેન્ટ્સ",
    Kannada: "ನಿಯೋಜನೆಗಳು", Kashmiri: "اسائنمنٹ", Konkani: "असायन्मेंट", Maithili: "असाइनमेंट", Malayalam: "അസൈൻമെന്റുകൾ",
    Manipuri: "ꯑꯦꯁꯥꯏꯟꯃꯦꯟꯠ", Marathi: "स्वाध्याय / असाइनमेंट", Nepali: "असाइनमेन्ट", Odia: "ଅସାଇନମେન્ટ", Punjabi: "ਅਸਾਈਨਮੈਂਟ",
    Sanskrit: "नियतकार्याणि", Santali: "ᱟᱥᱟᱭᱤᱱᱢᱮᱱᱴ", Sindhi: "اسائنمنٽس", Urdu: "اسائنمنٹس"
  },
  Students: {
    English: "Students", Tamil: "மாணவர்கள்", Hindi: "छात्र", Telugu: "విద్యార్థులు",
    Assamese: "ছাত্ৰ-ছাত্ৰী", Bengali: "ছাত্রছাত্রী", Bodo: "फरायसाफोर", Dogri: "विद्यार्थी", Gujarati: "વિદ્યાર્થીઓ",
    Kannada: "ವಿದ್ಯಾರ್ಥಿಗಳು", Kashmiri: "طلباء", Konkani: "विद्यार्थी", Maithili: "विद्यार्थी", Malayalam: "വിദ്യാർത്ഥികൾ",
    Manipuri: "ꯃꯍꯩꯔꯣꯏꯁꯤꯡ", Marathi: "विद्यार्थी", Nepali: "विद्यार्थीहरू", Odia: "ଛାତ୍ରଛାତ୍ରୀ", Punjabi: "ਵਿਦਿਆਰਥੀ",
    Sanskrit: "छात्राः", Santali: "ᱪᱮᱛᱮᱫᱤᱭᱟᱹᱠᱚ", Sindhi: "شاگرد", Urdu: "طلباء"
  },
  "AI Tools": {
    English: "AI Tools", Tamil: "AI கருவிகள்", Hindi: "एआई उपकरण", Telugu: "AI టూల్స్",
    Assamese: "AI সঁজুলি", Bengali: "AI সরঞ্জাম", Bodo: "AI टुलस", Dogri: "AI उपकरण", Gujarati: "AI સાધનો",
    Kannada: "AI ಉಪಕರಣಗಳು", Kashmiri: "AI ٹولز", Konkani: "AI साधनां", Maithili: "AI उपकरण", Malayalam: "AI ടൂളുകൾ",
    Manipuri: "AI ꯇꯨꯂꯁꯤꯡ", Marathi: "AI साधने", Nepali: "AI उपकरणहरू", Odia: "AI ଉପକରଣ", Punjabi: "AI ਟੂਲਜ਼",
    Sanskrit: "कृत्रिमबुद्धि-यन्त्राणि", Santali: "AI ᱴᱩᱞᱥ", Sindhi: "AI ٽولز", Urdu: "اے آئی ٹولز"
  },
  Analytics: {
    English: "Analytics", Tamil: "பகுப்பாய்வு", Hindi: "विश्लेषण", Telugu: "విశ్లేషణ",
    Assamese: "বিশ্লেষণ", Bengali: "বিশ্লেষণ", Bodo: "बिजिरनाय", Dogri: "विश्लेषण", Gujarati: "વિશ્લેષણ",
    Kannada: "ವಿಶ್ಲೇಷಣೆ", Kashmiri: "تجزیہ", Konkani: "विश्लेषण", Maithili: "विश्लेषण", Malayalam: "വിശകലനം",
    Manipuri: "ꯑꯦꯅꯥꯂꯥꯏꯇꯤꯛꯁ", Marathi: "विश्लेषण", Nepali: "विश्लेषण", Odia: "ବିଶ୍ଳେଷଣ", Punjabi: "ਵਿਸ਼ਲੇਸ਼ਣ",
    Sanskrit: "विश्लेषणम्", Santali: "ᱵᱤᱥᱞᱮᱥᱚᱱ", Sindhi: "تجزيئي", Urdu: "تجزیہ"
  },
  Notifications: {
    English: "Notifications", Tamil: "அறிவிப்புகள்", Hindi: "सूचनाएं", Telugu: "நோட்டிபிகேஷன்లు",
    Assamese: "বিজ্ঞপ্তি", Bengali: "বিজ্ঞপ্তি", Bodo: "मिथिसारनाय", Dogri: "सूचनां", Gujarati: "સૂચનાઓ",
    Kannada: "ಅಧಿಸೂಚನೆಗಳು", Kashmiri: "اطلاعات", Konkani: "सूचना", Maithili: "सूचना", Malayalam: "അറിയിപ്പുകൾ",
    Manipuri: "ꯅꯣꯇꯤꯐꯤꯀꯦꯁꯟ", Marathi: "सूचना", Nepali: "सूचनाहरू", Odia: "ବିଜ୍ଞପ୍ତି", Punjabi: "ਸੂਚਨਾਵਾਂ",
    Sanskrit: "सूचनाः", Santali: "ᱱᱳᱴᱤᱯᱷᱤᱠᱮᱥᱚᱱ", Sindhi: "اطلاعون", Urdu: "اطلاعات"
  },
  Profile: {
    English: "Profile", Tamil: "சுயவிவரம்", Hindi: "प्रोफ़ाइल", Telugu: "ప్రొఫైల్",
    Assamese: "প্রফাইল", Bengali: "প্রোফাইল", Bodo: "प्रोफाइल", Dogri: "प्रोफाइल", Gujarati: "પ્રોફાઇલ",
    Kannada: "ಪ್ರೊಫೈಲ್", Kashmiri: "پروفائل", Konkani: "प्रोफाइल", Maithili: "प्रोफाइल", Malayalam: "പ്രൊഫൈൽ",
    Manipuri: "ꯄ꯭ꯔꯣꯐꯥꯏꯜ", Marathi: "प्रोफाइल", Nepali: "प्रोफाइल", Odia: "ପ୍ରୋફਾਈଲ୍", Punjabi: "ਪ੍ਰੋਫਾਈਲ",
    Sanskrit: "परिचयपत्रम्", Santali: "ᱯᱨᱳᱯᱷᱟᱭᱤᱞ", Sindhi: "پروفائل", Urdu: "پروفائل"
  },
  Settings: {
    English: "Settings", Tamil: "அமைப்புகள்", Hindi: "செட்டிங்ஸ்", Telugu: "సెట్టింగ్‌లు",
    Assamese: "ছেটিংছ", Bengali: "সেটিংস", Bodo: "सेटिंगस", Dogri: "सैटिंग्स", Gujarati: "સેટિંગ્સ",
    Kannada: "ಸಂಯೋಜನೆಗಳು", Kashmiri: "سیٹنگس", Konkani: "मांडणी", Maithili: "सेटिंग्स", Malayalam: "ക്രമീകരണങ്ങൾ",
    Manipuri: "ꯁꯦꯇꯤꯡꯁ", Marathi: "सेटिंग्ज", Nepali: "सेटिङहरू", Odia: "ସେଟିଙ୍ଗ୍ସ", Punjabi: "ਸੈਟਿੰਗਾਂ",
    Sanskrit: "विन्यासाः", Santali: "ᱥᱮᱴᱤᱝᱥ", Sindhi: "سيٽنگون", Urdu: "سیٹنگز"
  },
  "Add New Course": {
    English: "Add New Course", Tamil: "புதிய பாடத்தை சேர்", Hindi: "नया पाठ्यक्रम जोड़ें", Telugu: "కొత్త కోర్సును జోడించండి",
    Assamese: "নতুন পাঠ্যক্ৰম যোগ কৰক", Bengali: "নতুন কোর্স যোগ করুন", Bodo: "गोदान आयदा सों", Dogri: "नवा कोर्स जोड़ो", Gujarati: "નવો કોર્સ ઉમેરો",
    Kannada: "ಹೊಸ ಕೋರ್ಸ್ ಸೇರಿಸಿ", Kashmiri: "نواں کورس جوڑیو", Konkani: "नवो कोर्स जोडात", Maithili: "नवीन पाठ्यक्रम जोड़ू", Malayalam: "പുതിയ കോഴ്‌സ് ചേർക്കുക",
    Manipuri: "ꯑꯅ꧀ꯧꯕ ꯀꯣꯔꯁ ꯍꯥꯞꯆꯤꯅꯕꯥ", Marathi: "नवीन अभ्यासक्रम जोडा", Nepali: "नयाँ पाठ्यक्रम थप्नुहोस्", Odia: "ନୂତନ ପାଠ୍ୟକ୍ରମ ଯୋଡନ୍ତୁ", Punjabi: "ਨਵਾਂ ਕੋਰਸ ਜੋੜੋ",
    Sanskrit: "नवीनं पाठ्यक्रमं योजयतु", Santali: "ᱱᱟᱶᱟ ᱠᱳᱨᱥ", Sindhi: "نائون ڪورس شامل ڪريو", Urdu: "نیا کورس شامل کریں"
  },

  // AI Tools Workspace Headers
  ai_workspace_title: {
    English: "AI Multilingual Utilities Workspace (23 Scheduled Languages)",
    Tamil: "AI பன்மொழி பயன்பாட்டு பணிமேடை (23 மொழிகள்)",
    Hindi: "एआई बहुभाषी उपयोगिता कार्यस्थान (23 भाषाएं)",
    Telugu: "AI బహుభాషా యుటిలిటీస్ వర్క్‌స్పేస్ (23 భాషలు)",
    Dogri: "AI बहुभाषी उपकरण कार्यस्थान (23 भाषां)",
    Assamese: "AI বহুভাষিক সঁজুলি কৰ্মক্ষেত্ৰ (২৩ ভাষা)",
    Bengali: "AI বহুভাষিক সরঞ্জাম ওয়ার্কস্পেস (২৩টি ভাষা)",
    Bodo: "AI बाहुभाषी टूलस वर्कस्पेस (23 राव)",
    Gujarati: "AI બહુભાષી સાધન કાર્યસ્થળ (23 ભાષાઓ)",
    Kannada: "AI ಬಹುಭಾಷಾ ಉಪಕರಣಗಳ ವರ್ಕ್‌ಸ್ಪೇಸ್ (23 ಭಾಷೆಗಳು)",
    Kashmiri: "AI کثیر اللسانی ورک سپیس (23 زبانیں)",
    Konkani: "AI बहुभाशीय साधन वर्कस्पेस (23 भासो)",
    Maithili: "AI बहुभाषी कार्यस्थान (23 भाषा)",
    Malayalam: "AI ബഹുഭാഷാ ടൂളുകൾ വർക്ക്സ്പേസ് (23 ഭാഷകൾ)",
    Manipuri: "AI ꯃꯜꯇꯤꯂꯤꯉ꯭ꯋꯦꯜ ꯋꯥꯔꯛꯁ꯭ꯄꯦꯁ (23 ꯂꯣꯟ)",
    Marathi: "AI बहुभाषिक साधन कार्यस्थान (23 भाषा)",
    Nepali: "AI बहुभाषी कार्यस्थल (२३ भाषाहरू)",
    Odia: "AI ବହୁଭାଷୀ ଉପକରଣ କାର୍ଯ୍ୟକ୍ଷେତ୍ର (୨୩ ଭାଷା)",
    Punjabi: "AI ਬਹੁ-ਭਾਸ਼ਾਈ ਟੂਲਜ਼ ਵਰਕਸਪੇਸ (23 ਭਾਸ਼ਾਵਾਂ)",
    Sanskrit: "कृत्रिमबुद्धि बहुभाषीय कार्यस्थानम् (२३ भाषाः)",
    Santali: "AI ᱵᱟᱹᱦᱩᱵᱷᱟᱥᱤ ᱴᱩᱞᱥ (23 ᱯᱟᱹᱨᱥᱤ)",
    Sindhi: "AI باھوباشي ورڪ اسپيس (23 ٻوليون)",
    Urdu: "اے آئی کثیر اللسانی ورک سپیس (23 زبانیں)"
  },
  ai_workspace_subtitle: {
    English: "Generate lecture notes, quizzes, flashcards, summaries, WebVTT subtitles, and voiceover scripts grounded in educator-posted materials in pure native scripts of all 23 scheduled Indian languages.",
    Tamil: "ஆசிரியர் பதிவேற்றிய பாடக் கோப்புகளின் அடிப்படையில் குறிப்புகள், வினாடி வினாக்கள் மற்றும் சுருக்கங்களை 23 அதிகாரப்பூர்வ இந்திய தாய்மொழிகளில் உருவாக்கவும்.",
    Hindi: "शिक्षक द्वारा पोस्ट की गई सामग्री के आधार पर सभी 23 आधिकारिक भारतीय भाषाओं की मूल लिपियों में अध्ययन नोट्स और प्रश्नोत्तरी तैयार करें।",
    Telugu: "ఉపాధ్యాయులు పోస్ట్ చేసిన కంటెంట్ ఆధారంగా 23 అధికారిక భారతీయ భాషలలో నోట్స్, క్విజ్‌లను రూపొందించండి.",
    Dogri: "शिक्षक सामग्री दे आधार पर सारियां 23 सरकारी भारतीय भाषाएं बिच्च अध्ययन नोट्स ते प्रश्नोत्तरी तैयार करो。"
  },
  ai_studio_badge: {
    English: "23 Languages Pure AI Studio",
    Tamil: "23 மொழிகள் AI ஸ்டுடியோ",
    Hindi: "23 भाषाएं एआई स्टूडियो",
    Telugu: "23 భాషలు AI స్టూడియో",
    Dogri: "23 भाषां AI स्टूडियो",
    Assamese: "২৩ ভাষা AI ষ্টুডিঅ'",
    Bengali: "২৩টি ভাষা AI স্টুডিও",
    Gujarati: "23 ભાષાઓ AI સ્ટુડિયો",
    Kannada: "23 ಭಾಷೆಗಳು AI ಸ್ಟುಡಿಯೋ",
    Malayalam: "23 ഭാഷകൾ AI സ്റ്റുഡിയോ",
    Marathi: "23 भाषा AI स्टुडिओ",
    Odia: "୨୩ ଭାଷା AI ଷ୍ଟୁଡିଓ",
    Punjabi: "23 ਭਾਸ਼ਾਵਾਂ AI ਸਟੂਡੀਓ",
    Urdu: "23 زبانیں اے آئی اسٹوڈیو"
  },
  view_content_library: {
    English: "View Content Library",
    Tamil: "பாடக் களஞ்சியத்தைக் காண்க",
    Hindi: "सामग्री पुस्तकालय देखें",
    Telugu: "కంటెంట్ లైబ్రరీ చూడండి",
    Dogri: "सामग्री पुस्तकालय देखो"
  },
  launch_interactive_studio: {
    English: "Launch Interactive Studio",
    Tamil: "ஊடாடும் ஸ்டுடியோவை இயக்கு",
    Hindi: "इंटरएक्टिव स्टूडियो चलाएं",
    Telugu: "ఇంటరాక్టివ్ స్టూడియోను ప్రారంభించండి",
    Dogri: "इंटरएक्टिव स्टूडियो चलाओ"
  },
  target_language_label: {
    Hindi: "पसंदीदा मातृभाषा",
    Telugu: "ఇష్టపడే మాతృభాష"
  },
  attach_course_label: {
    English: "Attach to Educator Course",
    Tamil: "ஆசிரியர் பாடத்துடன் இணைக்கவும்",
    Hindi: "पाठ्यक्रम से जोड़ें",
    Telugu: "కోర్సును ఎంచుకోండి"
  },
  topic_prompt_label: {
    English: "Source Topic / Question / Transcript (Analyzed against Educator Content)",
    Tamil: "பாடக் கேள்வி / தலைப்பு (ஆசிரியர் பதிவேற்றிய ஆதாரங்களில் பகுப்பாய்வு செய்யப்படும்)",
    Hindi: "विषय / प्रश्न / प्रतिलेख (शिक्षक सामग्री पर आधारित)",
    Telugu: "అంశం / ప్రశ్న (ఉపాధ్యాయ కంటెంట్ నుండి విశ్లేషించబడుతుంది)"
  },
  generate_ai_asset_btn: {
    English: "Analyze Educator Content & Generate AI Answer",
    Tamil: "ஆசிரியர் உள்ளடக்கத்தை பகுப்பாய்வு செய்து விடைகளை உருவாக்கு",
    Hindi: "सामग्री का विश्लेषण करें और उत्तर उत्पन्न करें",
    Telugu: "కంటెంట్‌ను విశ్లేషించి సమాధానం రూపొందించండి"
  },
  analyzing_educator_content: {
    English: "Analyzing Educator Uploaded Content & Translating...",
    Tamil: "ஆசிரியர் பதிவேற்றிய பாடக் கோப்புகளை AI பகுப்பாய்வு செய்கிறது...",
    Hindi: "शिक्षक सामग्री का विश्लेषण और अनुवाद किया जा रहा है...",
    Telugu: "ఉపాధ్యాయ కంటెంట్ విశ్లేషణ మరియు అనువాదం జరుగుతోంది..."
  },
  save_to_library_btn: {
    English: "Attach & Save Asset to Course Repository",
    Tamil: "பாடக் களஞ்சியத்தில் சேமிக்கவும்",
    Hindi: "सामग्री पुस्तकालय में सहेजें",
    Telugu: "కంటెంట్ లైబ్రరీలో సేవ్ చేయండి"
  },
  grounded_content_badge: {
    English: "Grounded in Educator Posted Material",
    Tamil: "ஆசிரியர் பதிவேற்றிய பாட ஆதாரங்களிலிருந்து பெறப்பட்டது",
    Hindi: "शिक्षक द्वारा पोस्ट की गई सामग्री पर आधारित",
    Telugu: "ఉపాధ్యాయులు పోస్ట్ చేసిన కంటెంట్ ఆధారంగా"
  },

  // Dashboard Overview Translation Keys (23 Languages Supported)
  welcome_educator: {
    English: "Welcome back, Educator!",
    Assamese: "স্বাগতম, শিক্ষক!",
    Bengali: "স্বাগতম, শিক্ষক!",
    Bodo: "सिमबि फोरोंगिरि!",
    Dogri: "जी आयां गी, शिक्षकजी!",
    Gujarati: "પાછા સ્વાગત છે, શિક્ષક!",
    Hindi: "शिक्षक महोदय, आपका स्वागत है!",
    Kannada: "ಮತ್ತೆ ಸ್ವಾಗತ, ಶಿಕ್ಷಕರೇ!",
    Kashmiri: "خوش آمدید، استاد جی!",
    Konkani: "परत येवकार, शिक्षक!",
    Maithili: "स्वागत अछि, शिक्षक!",
    Malayalam: "വീണ്ടും സ്വാഗതം, അധ്യാപകാ!",
    Manipuri: "ꯇꯔꯥꯝꯅ ꯑꯣꯀꯆꯔꯤ ꯑꯣꯖꯥ!",
    Marathi: "पुन्हा स्वागत आहे, शिक्षक!",
    Nepali: "पुनः स्वागत छ, शिक्षक!",
    Odia: "ପୁନର୍ବାର ସ୍ୱାଗତ, ଶିକ୍ଷକ!",
    Punjabi: "ਜੀ ਆਇਆਂ ਨੂੰ, ਅਧਿਆਪਕ ਜੀ!",
    Sanskrit: "पुनरागमनम् नमो नमः, गुरवः!",
    Santali: "ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ ᱪᱮᱪᱮᱫᱤᱭᱟᱹ!",
    Sindhi: "ڀلي ڪري آيا، استاد!",
    Tamil: "மீண்டும் வருக, ஆசிரியரே!",
    Telugu: "స్వాగతం, ఉపాధ్యాయులారా!",
    Urdu: "خوش آمدید، استاد محترم!"
  },
  welcome_subtitle: {
    English: "Manage your courses, uploaded materials, and live interactive classes for your students in real-time.",
    Assamese: "আপোনাৰ পাঠ্যক্ৰম, আপলোড কৰা সামগ্ৰী আৰু শিক্ষাৰ্থীসকলৰ বাবে লাইভ শ্ৰেণীসমূহ পৰিচালনা কৰক।",
    Bengali: "আপনার কোর্স, আপলোড করা উপাদান এবং লাইভ কাস পরিচালনা করুন।",
    Bodo: "नोंथांनि आयदा, अपलोड खालामनाय मुवा आरो लाइभ क्लासफोरखौ बिजिर।",
    Dogri: "अपने कोर्स, अपलोड कीती सामग्री ते छात्रें लेई लाइव कक्षां दा प्रबंधन करो।",
    Gujarati: "તમારા અભ્યાસક્રમો, અપલોડ કરેલી સામગ્રી અને લાઈવ વર્ગોનું સંચાલન કરો.",
    Hindi: "अपने पाठ्यक्रमों, अपलोड की गई सामग्री और छात्रों के लिए लाइव कक्षाओं का प्रबंधन करें।",
    Kannada: "ನಿಮ್ಮ ಕೋರ್ಸ್‌ಗಳು, ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಸಾಮಗ್ರಿಗಳು ಮತ್ತು ಲೈವ್ ತರಗತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    Kashmiri: "پہنِیو کورسو، اپلوڈ گومُت مواد تہٕ لائیو کلاسو منٛز پربندھ کرو۔",
    Konkani: "तुमचे कोर्स, अपलोड केल्ली सामग्री आनी लाइव्ह क्लासीसचे वेवस्थापन करात.",
    Maithili: "अहाँ अपन पाठ्यक्रम, अपलोड कएल सामग्री आ लाइव क्लासक प्रबंधन करू।",
    Malayalam: "നിങ്ങളുടെ കോഴ്സുകൾ, അപ്‌ലോഡ് ചെയ്ത മെറ്റീരിയലുകൾ, ലൈവ് ക്ലാസുകൾ എന്നിവ നിയന്ത്രിക്കുക.",
    Manipuri: "ꯑꯗꯣꯃꯒꯤ ꯀꯣꯔꯁꯁꯤꯡ, ꯑꯞꯂꯣꯗ ꯇꧧꯈꯤꯕ ꯃꯋꯥꯡ ꯑꯃꯁꨨꯡ ꯂꯥꯏ꯭ꯚ ꯀ꯭ꯂꯥꯁꯁꯤꯡ ꯁꯤꯟ-ꯂꯥꯡꯕꯤꯌꯨ꯫",
    Marathi: "तुमचे अभ्यासक्रम, अपलोड केलेली सामग्री आणि थेट वर्गांचे व्यवस्थापन करा.",
    Nepali: "तपाईंको पाठ्यक्रम, अपलोड गरिएका सामग्री र लाइभ कक्षाहरू व्यवस्थापन गर्नुहोस्।",
    Odia: "ଆପଣଙ୍କର ପାଠ୍ୟକ୍ରମ, ଅପଲୋଡ୍ ସାମଗ୍ରୀ ଏବଂ ଲାଇଭ୍ କ୍ଲାସ୍ ପରିଚାଳନା କରନ୍ତୁ।",
    Punjabi: "ਆਪਣੇ ਕੋਰਸਾਂ, ਅੱਪਲੋਡ ਕੀਤੀ ਸਮੱਗਰੀ ਅਤੇ ਲਾਈਵ ਕਲਾਸਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।",
    Sanskrit: "भवतां पाठ्यक्रमान्, संकलितसामग्रीः, प्रत्यक्षवर्गांश्च प्रबन्धयन्तु।",
    Santali: "ᱟᱢᱟᱜ ᱠᱳᱨᱥ ᱟᱨ ᱞᱟive ᱠᱞᱟᱥ manage ᱢᱮ.",
    Sindhi: "پنهنجا ڪورس، اپلوڊ ٿيل مواد ۽ لائيو ڪلاسون سنڀاليو.",
    Tamil: "உங்கள் பாடநெறிகள், கோப்புகள் மற்றும் நேரலை வகுப்புகளை நிர்வகிக்கவும்.",
    Telugu: "మీ కోర్సులు, అప్‌లోడ్ చేసిన మెటీరియల్‌లు మరియు లైవ్ క్లాస్‌లను నిర్వహించండి.",
    Urdu: "اپنے کورسز، اپ لوڈ کردہ مواد اور لائیو کلاسز کا انتظام کریں۔"
  },
  total_courses: {
    English: "Total Courses", Assamese: "মুঠ পাঠ্যক্ৰম", Bengali: "মোট কোর্স", Bodo: "गासै आयदा", Dogri: "कुल कोर्स", Gujarati: "કુલ કોર્સ", Hindi: "कुल पाठ्यक्रम", Kannada: "ಒಟ್ಟು ಕೋರ್ಸ್‌ಗಳು", Kashmiri: "کل کورس", Konkani: "कुल कोर्स", Maithili: "कुल पाठ्यक्रम", Malayalam: "ആകെ കോഴ്‌സുകൾ", Manipuri: "ꯑꯄꯨꯅꯕ ꯀꯣꯔꯁ", Marathi: "एकूण अभ्यासक्रम", Nepali: "कुल पाठ्यक्रम", Odia: "ମୋଟ ପାଠ୍ୟକ୍ରମ", Punjabi: "ਕੁੱਲ ਕੋਰਸ", Sanskrit: "सम्पूर्णपाठ्यक्रमाः", Santali: "ᱡᱚᱛᱚ ᱠᱳᱨᱥ", Sindhi: "ڪل ڪورس", Tamil: "மொத்த பாடநெறிகள்", Telugu: "మొత్తం కోర్సులు", Urdu: "کل کورسز"
  },
  active_course_hosted: {
    English: "1 active course hosted", Assamese: "১ টা সক্ৰিয় পাঠ্যক্ৰম সম্প্ৰচাৰিত", Bengali: "১টি সক্রিয় কোর্স হোস্ট করা হয়েছে", Dogri: "1 सक्रिय कोर्स होस्ट कीता गेया", Hindi: "1 सक्रिय पाठ्यक्रम होस्ट किया गया", Tamil: "1 நேரலை பாடம் வழங்கப்படுகிறது", Telugu: "1 సక్రియ కోర్సు హోస్ట్ చేయబడింది"
  },
  students_enrolled: {
    English: "Students Enrolled", Assamese: "নামভৰ্তি কৰা ছাত্ৰ-ছাত্ৰী", Bengali: "নিবন্ধিত শিক্ষার্থী", Bodo: "फरायसाफोर", Dogri: "नामांकित छात्र", Gujarati: "નોંધાયેલ વિદ્યાર્થીઓ", Hindi: "नामांकित छात्र", Kannada: "ನೊಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳು", Malayalam: "എൻറോൾ ചെയ്ത വിദ്യാർത്ഥികൾ", Marathi: "नोंदणीकृत विद्यार्थी", Punjabi: "ਦਾਖਲ ਹੋਏ ਵਿਦਿਆਰਥੀ", Tamil: "சேர்ந்த மாணவர்கள்", Telugu: "నమోదైన విద్యార్థులు", Urdu: "درج شدہ طلباء"
  },
  total_enrollments: {
    English: "Total enrollments across courses", Assamese: "সকলো পাঠ্যক্ৰমত মুঠ নামভৰ্তি", Bengali: "সমস্ত কোর্সে মোট এনরোলমেন্ট", Dogri: "सारें कोर्सें बिच्च कुल नामांकन", Hindi: "सभी पाठ्यक्रमों में कुल नामांकन", Tamil: "அனைத்து பாடங்களிலும் மொத்த சேர்க்கை", Telugu: "అన్ని కోర్సులలో మొత్తం ఎన్‌రోల్‌మెంట్‌లు"
  },
  upcoming_live_classes: {
    English: "Upcoming Live Classes", Assamese: "আগন্তুক লাইভ শ্ৰেণী", Bengali: "আগামী লাইভ ক্লাস", Dogri: "आउने वालियां लाइव कक्षां", Gujarati: "આગામી લાઇવ વર્ગો", Hindi: "आगामी लाइव कक्षाएं", Kannada: "ಮುಂಬರುವ ಲೈವ್ ತರಗತಿಗಳು", Malayalam: "വരാനിരിക്കുന്ന ലൈവ് ക്ലാസുകൾ", Marathi: "पुढील थेट वर्ग", Punjabi: "ਆਉਣ ਵਾਲੀਆਂ ਲਾਈਵ ਕਲਾਸਾਂ", Tamil: "வரவிருக்கும் நேரலை வகுப்புகள்", Telugu: "రాబోయే లైవ్ క్లాసెస్", Urdu: "آنے والی لائیو کلاسز"
  },
  next_session_scheduled: {
    English: "Next session scheduled", Assamese: "পৰৱৰ্তী শ্ৰেণী নিৰ্ধাৰিত", Bengali: "পরবর্তী সেশন নির্ধারিত", Dogri: "अगला सत्र निर्धारित", Hindi: "अगला सत्र निर्धारित", Tamil: "அடுத்த வகுப்பு திட்டமிடப்பட்டது", Telugu: "తదుపరి సెషన్ షెడ్యూల్ చేయబడింది"
  },
  files_uploaded: {
    English: "Files Uploaded", Assamese: "আপলোড কৰা ফাইলসমূহ", Bengali: "আপলোড করা ফাইল", Dogri: "अपलोड कीते दे फाइल", Gujarati: "અપલોડ કરેલ ફાઈલો", Hindi: "अपलोड की गई फाइलें", Kannada: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಫೈಲ್‌ಗಳು", Malayalam: "അപ്‌ലോഡ് ചെയ്ത ഫയലുകൾ", Marathi: "अपलोड केलेल्या फायली", Punjabi: "ਅੱਪਲੋਡ ਕੀਤੀਆਂ ਫਾਈਲਾਂ", Tamil: "பதிவேற்றப்பட்ட கோப்புகள்", Telugu: "అప్‌లోడ్ చేసిన ఫైళ్లు", Urdu: "اپ لوڈ کردہ فائلیں"
  },
  across_all_course_modules: {
    English: "Across all course modules", Assamese: "সকলো পাঠ্যক্ৰম মডিউলজুৰি", Bengali: "সমস্ত কোর্স মডিউলে", Dogri: "सारें कोर्स मॉड्यूलें बिच्च", Hindi: "सभी पाठ्यक्रम मॉड्यूल में", Tamil: "அனைத்து பாடத் தொகுதிகளிலும்", Telugu: "అన్ని కోర్సు మాడ్యూళ్లలో"
  },
  quick_actions: {
    English: "Quick Actions", Assamese: "দ্ৰুত কাৰ্য্যসমূহ", Bengali: "দ্রুত পদক্ষেপ", Dogri: "त्वरित कार्रवाई", Gujarati: "ઝડપી ક્રિયાઓ", Hindi: "त्वरित कार्य", Kannada: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು", Malayalam: "ദ്രുത നടപടികൾ", Marathi: "जलद कृती", Punjabi: "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ", Tamil: "விரைவு செயல்பாடுகள்", Telugu: "త్వరిత చర్యలు", Urdu: "فوری اقدامات"
  },
  fast_shortcuts: {
    English: "Fast Shortcuts", Assamese: "দ্ৰুত শৰ্টকাট", Bengali: "দ্রুত শর্টকাট", Dogri: "तेज शॉर्टकट", Hindi: "फास्ट शॉर्टकट", Tamil: "வேகமான குறுக்குவழிகள்", Telugu: "ఫాస్ట్ షార్ట్‌కట్‌లు"
  },
  recent_activity_feed: {
    English: "Recent Activity Feed", Assamese: "সাম্প্রতিক কার্যকলাপ ফিড", Bengali: "সাম্প্রতিক ক্রিয়াকলাপের ফিড", Dogri: "हालिया गतिविधि फ़ीड", Gujarati: "તાજેતરની પ્રવૃત્તિ ફીડ", Hindi: "हालिया गतिविधि फ़ीड", Kannada: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ ಫೀಡ್", Malayalam: "സമീപകാല പ്രവർത്തന ഫീഡ്", Marathi: "नुकतीच झालेली कृती", Punjabi: "ਤਾਜ਼ਾ ਗਤੀਵਿਧੀ ਫੀਡ", Tamil: "சமீபத்திய செயல்பாடுகள்", Telugu: "ఇటీవలి కార్యాచరణ ఫీడ్", Urdu: "حالیہ سرگرمی فیڈ"
  },
  live_audit_log: {
    English: "Live Audit Log", Assamese: "লাইভ অডিট লগ", Bengali: "লাইভ অডিট লগ", Dogri: "लाइव ऑडिट लॉग", Hindi: "लाइव ऑडिट लॉग", Tamil: "நேரலை தணிக்கை नोंदवैकள்", Telugu: "లైవ్ ఆడిట్ లాగ్"
  },
  quick_create_course: {
    English: "Quick Create Course", Assamese: "দ্ৰুত পাঠ্যক্ৰম সৃষ্টি কৰক", Bengali: "দ্রুত কোর্স তৈরি করুন", Dogri: "नवा कोर्स जल्दी बनाओ", Hindi: "त्वरित पाठ्यक्रम बनाएं", Tamil: "விரைவாக பாடம் உருவாக்கு", Telugu: "కోర్సును త్వరగా సృష్టించండి"
  },
  quick_create_course_desc: {
    English: "Design and publish vocational learning modules (unlimited)", Assamese: "বৃত্তিমূলক শিকন মডিউল ডিজাইন আৰু প্ৰকাশ কৰক", Bengali: "ভোকেশনাল লার্নিং মডিউল তৈরি করুন", Dogri: "व्यावसायिक शिक्षण मॉड्यूल तैयार करो", Hindi: "व्यावसायिक शिक्षण मॉड्यूल डिज़ाइन करें", Tamil: "தொழிற்கல்வி பாடங்களை வடிவமைக்கவும்", Telugu: "వృత్తి విద్యా మాడ్యూళ్లను రూపొందించండి"
  },
  upcoming_live_classes_desc: {
    English: "Plan realtime interactive sessions with students", Assamese: "ছাত্ৰ-ছাত্ৰীসকলৰ সৈতে লাইভ কাৰ্যসূচী প্ৰস্তুত কৰক", Bengali: "শিক্ষার্থীদের সাথে রিয়েলটাইম লাইভ সিডিউল করুন", Dogri: "छात्रें कन्नै लाइव सत्र योजना बनाओ", Hindi: "छात्रों के साथ रियल-टाइम लाइव सत्रों की योजना बनाएं", Tamil: "மாணவர்களுடன் நேரலை வகுப்புகளை திட்டமிடுங்கள்", Telugu: "విద్యార్థులతో లైవ్ సెషన్‌లను ప్లాన్ చేయండి"
  },
  files_upload_center: {
    English: "Files Upload Center", Assamese: "ফাইল আপলোড কেন্দ্ৰ", Bengali: "ফাইল আপলোড সেন্টার", Dogri: "फाइल अपलोड केंद्र", Hindi: "फ़ाइल अपलोड केंद्र", Tamil: "கோப்புகள் பதிவேற்ற மையம்", Telugu: "ఫైళ్ల అప్‌లోడ్ కేంద్రం"
  },
  files_upload_center_desc: {
    English: "Add videos, PDFs, and presentations to your library", Assamese: "ভিডিঅ', পিডিএফ আৰু উপস্থাপন যোগ কৰক", Bengali: "ভিডিও, পিডিএফ এবং প্রেজেন্টেশন যোগ করুন", Dogri: "वीडियो, पीडीएफ ते प्रेजेंटेशन जोड़ो", Hindi: "लाइब्रेरी में वीडियो, पीडीएफ और प्रस्तुतियाँ जोड़ें", Tamil: "வீடியோக்கள், PDFகள் மற்றும் விளக்கக்காட்சிகளைச் சேர்க்கவும்", Telugu: "వీడియోలు, PDFలు మరియు ప్రెజెంటేషన్‌లను జోడించండి"
  },
  view_analytics: {
    English: "View Analytics", Assamese: "বিশ্লেষণ চাওক", Bengali: "এনালাইটিক্স দেখুন", Dogri: "विश्लेषण देखो", Hindi: "विश्लेषण देखें", Tamil: "பகுப்பாய்வைக் காண்க", Telugu: "విశ్లేషణను చూడండి"
  },

  // Tool Titles & Descriptions
  notes_generator_title: {
    English: "AI Notes Generator",
    Tamil: "AI பாடக் குறிப்புகள் உருவாக்குபவை",
    Hindi: "एआई नोट्स जेनरेटर",
    Telugu: "AI నోట్స్ జెనరేటర్"
  },
  notes_generator_desc: {
    English: "Generate structured study notes directly from educator-uploaded syllabus and lecture transcripts in pure native script.",
    Tamil: "ஆசிரியர் பதிவேற்றிய பாடத்திட்டம் மற்றும் குறிப்புகளிலிருந்து நேரடி பாடக் குறிப்புகளை உருவாக்குகிறது.",
    Hindi: "शिक्षक द्वारा अपलोड किए गए पाठ्यक्रम और नोट्स से सीधे विस्तृत अध्ययन नोट्स बनाएं।",
    Telugu: "ఉపాధ్యాయులు అప్‌లోడ్ చేసిన సిలబస్ నుండి నేరుగా స్టడీ నోట్స్ రూపొందించండి."
  },
  quiz_generator_title: {
    English: "AI Quiz Generator",
    Tamil: "AI வினாடி வினா உருவாக்குபவை",
    Hindi: "एआई क्विज जेनरेटर",
    Telugu: "AI క్విజ్ జెనరేటర్"
  },
  quiz_generator_desc: {
    English: "Create interactive multiple-choice check questions with answer keys from educator exam papers and question banks.",
    Tamil: "ஆசிரியரின் 2-மதிப்பெண் வினா வங்கி மற்றும் தேர்வு தாள்களிலிருந்து வினாடி வினாக்களை உருவாக்குகிறது.",
    Hindi: "शिक्षक के प्रश्न बैंक और परीक्षा पत्रों से बहुविकल्पीय प्रश्न बनाएं।",
    Telugu: "ఉపాధ్యాయుల ప్రశ్న బ్యాంక్ ఆధారంగా క్విజ్‌లను రూపొందించండి."
  },
  flashcards_compiler_title: {
    English: "AI Flashcards Compiler",
    Tamil: "AI நினைவூட்டும் அட்டைகள் தொகுப்பி",
    Hindi: "एआई फ्लैशकार्ड संकलक",
    Telugu: "AI ఫ్లాష్‌కార్డ్స్ కம்పైలர்"
  },
  flashcards_compiler_desc: {
    English: "Compile key definitions, formulas, and 2-mark Q&As into study decks ready for student practice.",
    Tamil: "முக்கிய வரைவிலக்கணங்கள், சூத்திரங்கள் மற்றும் 2-மதிப்பெண் வினாக்களை நினைவூட்டும் அட்டைகளாக தொகுக்கிறது.",
    Hindi: "महत्वपूर्ण परिभाषाओं और सूत्रों को अध्ययन कार्डों में संकलित करें।",
    Telugu: "ముఖ్యమైన సూత్రాలు మరియు నిర్వచనాలను స్టడీ కార్డ్‌లుగా మార్చండి."
  },
  course_summary_title: {
    English: "AI Course Summary",
    Tamil: "AI பாடநெறி சுருக்கம்",
    Hindi: "एआई पाठ्यक्रम सारांश",
    Telugu: "AI కోర్సు సారాంశం"
  },
  course_summary_desc: {
    English: "Condense long educator lecture notes, Part-B spreadsheets, or safety videos into concise study bullet points.",
    Tamil: "ஆசிரியர் பதிவேற்றிய நீண்ட பாட புத்தகங்கள் மற்றும் விரிவுரைகளை சுருக்கமான குறிப்புகளாக மாற்றுகிறது.",
    Hindi: "लंबी पाठ्यसामग्री और व्याख्यानों को संक्षिप्त मुख्य बिंदुओं में सारांशित करें।",
    Telugu: "సుదీర్ఘమైన పాఠ్యాంశాలను సంక్షిప్త పాయింట్లుగా కుదించండి."
  },
  translation_engine_title: {
    English: "AI Multilingual Translation",
    Tamil: "AI பன்மொழி மொழிபெயர்ப்பு",
    Hindi: "एआई बहुभाषी अनुवाद",
    Telugu: "AI బహుభాషా అనువాదం"
  },
  translation_engine_desc: {
    English: "Translate textbook pages and handouts into any of the 23 official scheduled Indian languages.",
    Tamil: "பாடநூல் பக்கங்கள் மற்றும் கோப்புகளை 23 அதிகாரப்பூர்வ இந்திய மொழிகளில் மொழிபெயர்க்கிறது.",
    Hindi: "पाठ्यपुस्तक पृष्ठों का 23 आधिकारिक भारतीय भाषाओं में अनुवाद करें।",
    Telugu: "పాఠ్యపుస్తకాలను 23 అధికారిక భారతీయ భాషలలోకి అనువదించండి."
  },
  subtitle_generator_title: {
    English: "AI Subtitle Generator",
    Tamil: "AI சப்டைட்டில் உருவாக்குபவை",
    Hindi: "एआई उपशीर्षक जेनरेटर",
    Telugu: "AI సబ్‌టైటిல் జెనరేటర్"
  },
  subtitle_generator_desc: {
    English: "Extract spoken speech from videos and generate aligned WebVTT subtitles in target Indian dialects.",
    Tamil: "வீடியோக்களிலிருந்து பேச்சை பிரித்தெடுத்து துல்லியமான WebVTT சப்டைட்டில்களை உருவாக்குகிறது.",
    Hindi: "वीडियो से भाषण निकालकर सटीक उपशीर्षक (WebVTT) उत्पन्न करें।",
    Telugu: "వీడియోల నుండి మాటలను గుర్తించి సబ్‌టైటిల్స్ రూపొందించండి."
  },
  voiceover_dubber_title: {
    English: "AI Voice-over Dubber",
    Tamil: "AI குரல் டப்பிங் கருவி",
    Hindi: "एआई वॉयस-ओवर डबिंग",
    Telugu: "AI వాయిస్-ఓవర్ డబ్బింగ్"
  },
  voiceover_dubber_desc: {
    English: "Convert text translations into natural speech voices for multi-dialect audio dubbing.",
    Tamil: "உரை மொழிபெயர்ப்புகளை இயல்பான ஒலி வடிவமாக மாற்றி குரல் டப்பிங் செய்கிறது.",
    Hindi: "पाठ अनुवादों को प्राकृतिक आवाज में बदलें और डबिंग करें।",
    Telugu: "వచనాన్ని సహజమైన వాయిస్ డబ్బింగ్‌గా మార్చండి."
  },
  tutor_companion_title: {
    English: "AI Classroom Tutor Config",
    Tamil: "AI வகுப்பறை ஆசிரியர் அமைவாக்கம்",
    Hindi: "एआई ट्यूटर कॉन्फ़िगरेशन",
    Telugu: "AI ట్యూటర్ కాన్ఫిగరేషన్"
  },
  tutor_companion_desc: {
    English: "Setup training parameters and custom system prompts grounded in educator content for student chat bots.",
    Tamil: "ஆசிரியர் பதிவேற்றிய பாடக் கோப்புகளை ஆதாரமாக கொண்டு மாணவர் சாட்பாட்டை அமைவாக்கம் செய்கிறது.",
    Hindi: "शिक्षक सामग्री पर आधारित छात्र चैटबॉट के लिए सिस्टम प्रॉम्प्ट कॉन्फ़िगर करें।",
    Telugu: "విద్యార్థి చాట్‌బాట్ కోసం ఉపాధ్యాయ కంటెంట్ ఆధారిత ప్రాంప్ట్‌లను కాన్ఫిగర్ చేయండి."
  },

  educator_dashboard: {
    English: "Educator Dashboard",
    Hindi: "शिक्षक डैशबोर्ड",
    Tamil: "ஆசிரியர் டாஷ்போர்டு",
    Telugu: "ఉపాధ్యాయ డాష్‌బోర్డ్"
  },
  preferred_language: {
    English: "Preferred Language",
    Hindi: "पसंदीदा भाषा",
    Tamil: "விருப்பமான மொழி",
    Telugu: "இஷ்டపడే భాష"
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
    if (saved && ALL_23_LANGUAGES.includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('skillverse_preferred_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language] as string;
    }
    if (translations[key] && translations[key]['English']) {
      return translations[key]['English'] as string;
    }
    if (key.includes('_')) {
      return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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
