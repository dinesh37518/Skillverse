import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/providers/language_provider.dart';
import '../../core/constants/app_translations.dart';

class HomeTab extends ConsumerStatefulWidget {
  const HomeTab({super.key});

  @override
  ConsumerState<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends ConsumerState<HomeTab> {
  int _quoteIndex = 0;

  final List<Map<String, String>> _wellnessQuotes = [
    {
      "en": "Success isn't final, failure isn't fatal: it's the courage to continue that counts. — Winston Churchill",
      "hi": "सफलता अंतिम नहीं है, विफलता घातक नहीं है: जारी रखने का साहस ही मायने रखता है। — विंस्टन चर्चिल",
      "ta": "வெற்றி இறுதியானது அல்ல, தோல்வி மரணமானது அல்ல: தொடரும் துணிச்சலே முக்கியமானது. — வின்ஸ்டன் சர்ச்சில்",
      "te": "విజయం అంతిమం కాదు, వైఫల్యం ప్రాణాంతకం కాదు: కొనసాగించే ధైర్యమే ముఖ్యం. — విన్‌స్టన్ చర్చిల్"
    },
    {
      "en": "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
      "hi": "सीखने की सबसे खूबसूरत बात यह है कि कोई भी इसे आपसे छीन नहीं सकता। — बी.बी. किंग",
      "ta": "கற்றலின் அழகிய விஷயம் என்னவென்றால், அதை உங்களிடமிருந்து யாரும் பறிக்க முடியாது. — பி.பி. கிங்",
      "te": "నేర్చుకోవడంలో అందమైన విషయం ఏమిటంటే దానిని మీ నుండి ఎవరూ తీసివేయలేరు. — బి.బి. కింగ్"
    },
    {
      "en": "Focus on progress, not perfection. Every small step builds your mastery.",
      "hi": "प्रगति पर ध्यान दें, पूर्णता पर नहीं। हर छोटा कदम आपकी महारत बनाता है।",
      "ta": "முன்னேற்றத்தில் கவனம் செலுத்துங்கள், பூரணத்துவத்தில் அல்ல. ஒவ்வொரு சிறிய அடியும் உங்கள் திறனை வளர்க்கிறது.",
      "te": "పురోగతిపై దృష్టి పెట్టండి, పరిపూర్ణతపై కాదు. ప్రతి చిన్న అడుగు మీ నైపుణ్యాన్ని పెంచుతుంది."
    },
    {
      "en": "Take care of your mind and body. A refreshed student learns 3x faster!",
      "hi": "अपने मन और शरीर का ख्याल रखें। एक तरोताजा छात्र 3 गुना तेजी से सीखता है!",
      "ta": "உங்கள் மனதையும் உடலையும் கவனித்துக் கொள்ளுங்கள். புத்துணர்ச்சியூட்டும் மாணவர் 3 மடங்கு வேகமாக கற்றுக்கொள்கிறார்!",
      "te": "మీ మనస్సు మరియు శరీరాన్ని జాగ్రత్తగా చూసుకోండి. రిఫ్రెష్ అయిన విద్యార్థి 3 రెట్లు వేగంగా నేర్చుకుంటాడు!"
    }
  ];

  void _shuffleQuote() {
    setState(() {
      _quoteIndex = Random().nextInt(_wellnessQuotes.length);
    });
  }

  String _getLocalizedQuote(String language) {
    final quoteMap = _wellnessQuotes[_quoteIndex];
    if (quoteMap.containsKey(language)) return quoteMap[language]!;
    if (language.startsWith("Hindi") && quoteMap.containsKey("hi")) return quoteMap["hi"]!;
    if (language.startsWith("Tamil") && quoteMap.containsKey("ta")) return quoteMap["ta"]!;
    if (language.startsWith("Telugu") && quoteMap.containsKey("te")) return quoteMap["te"]!;
    return quoteMap["en"] ?? quoteMap.values.first;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final user = Supabase.instance.client.auth.currentUser;
    final currentLanguage = ref.watch(languageProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SkillVerse AI', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => context.push('/notifications'),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Section
            Text(
              user != null 
                  ? AppTranslations.translate('welcome_back', currentLanguage) 
                  : 'Welcome to SkillVerse!',
              style: theme.textTheme.titleLarge?.copyWith(fontSize: 24),
            ),
            Text(
              user != null 
                  ? AppTranslations.translate('welcome_sub', currentLanguage) 
                  : 'Log in to save your learning progress',
              style: const TextStyle(color: Colors.white60, fontSize: 14),
            ),
            const SizedBox(height: 20),

            // Daily Motivation & Wellness Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.amber.shade900.withOpacity(0.4), Colors.orange.shade800.withOpacity(0.2)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.amber.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.wb_sunny_rounded, color: Colors.amber, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            AppTranslations.translate('daily_motivation', currentLanguage),
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.amberAccent),
                          ),
                        ],
                      ),
                      TextButton.icon(
                        onPressed: _shuffleQuote,
                        icon: const Icon(Icons.shuffle_rounded, size: 14, color: Colors.amber),
                        label: Text(
                          AppTranslations.translate('shuffle_quote', currentLanguage),
                          style: const TextStyle(color: Colors.amber, fontSize: 12),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '“${_getLocalizedQuote(currentLanguage)}”',
                    style: const TextStyle(fontSize: 14, fontStyle: FontStyle.italic, color: Colors.white, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Interactive Fun Session & Study Break Launcher Card
            InkWell(
              onTap: () => context.push('/fun-session'),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF1E1B4B)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.pinkAccent.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.pinkAccent.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.extension_rounded, color: Colors.pinkAccent, size: 28),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            AppTranslations.translate('fun_session_title', currentLanguage),
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            AppTranslations.translate('fun_session_desc', currentLanguage),
                            style: const TextStyle(color: Colors.white60, fontSize: 11, height: 1.3),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.pinkAccent,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text('Play', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white)),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Live Class Banner (Join Class Trigger)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Colors.violet, Colors.indigo],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.redAccent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text('LIVE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        AppTranslations.translate('live_class', currentLanguage),
                        style: const TextStyle(color: Colors.white70),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Electrical Controls & Motor Installation',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Translating instantly into $currentLanguage.',
                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.push('/classroom/mock-session-id-101'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.violet,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Text(AppTranslations.translate('join_classroom', currentLanguage)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Analyze Video URL Launcher Card
            InkWell(
              onTap: () => context.push('/video-analysis'),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.cyanAccent.withOpacity(0.15)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.cyanAccent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.video_library_rounded, color: Colors.cyanAccent, size: 28),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Analyze Video URL',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Generate AI notes, revision guides, study flashcards & practice test quizzes from any web video.',
                            style: TextStyle(color: Colors.white54, fontSize: 11, height: 1.3),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white54, size: 14),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Categories Section
            Text(AppTranslations.translate('categories', currentLanguage), style: theme.textTheme.titleLarge),
            const SizedBox(height: 12),
            SizedBox(
              height: 100,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _categoryCard(Icons.electrical_services, 'Electrical'),
                  _categoryCard(Icons.plumbing, 'Plumbing'),
                  _categoryCard(Icons.precision_manufacturing, 'Machinist'),
                  _categoryCard(Icons.carpenter, 'Carpentry'),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Featured Courses List
            Text(AppTranslations.translate('featured_courses', currentLanguage), style: theme.textTheme.titleLarge),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 2,
              itemBuilder: (context, index) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(12),
                    leading: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.violet.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.menu_book, color: Colors.deepPurpleAccent),
                    ),
                    title: Text(index == 0 ? 'DC Motor Wiring Basics' : 'Grounding & Shielding Safety'),
                    subtitle: Text(index == 0 ? 'Electrical | 6 lessons' : 'Safety Regulations | 4 lessons'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {},
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _categoryCard(IconData icon, String title) {
    return Container(
      width: 100,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: Colors.deepPurpleAccent, size: 32),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
