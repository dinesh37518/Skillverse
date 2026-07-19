import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<Map<String, dynamic>> _slides = [
    {
      'title': 'Interactive AI Tutor',
      'desc': 'Ask questions, explain complex vocational diagrams, or trigger custom study tests instantly using Llama 3.',
      'icon': Icons.psychology_rounded,
      'color': Colors.deepPurpleAccent,
    },
    {
      'title': 'Live Multilingual Classes',
      'desc': 'Attend live institutional training lectures with real-time audio dubbing and localized subtitles in your own language.',
      'icon': Icons.video_chat_rounded,
      'color': Colors.cyanAccent,
    },
    {
      'title': 'Learn in Your Language',
      'desc': 'Full translation coverage supporting English and all 22 scheduled Indian languages across lessons, notes, and study cards.',
      'icon': Icons.translate_rounded,
      'color': Colors.amberAccent,
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            children: [
              // Skip option
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => context.go('/auth'),
                  child: const Text('Skip', style: TextStyle(color: Colors.white54)),
                ),
              ),
              
              // Slide PageView
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (idx) => setState(() => _currentIndex = idx),
                  itemCount: _slides.length,
                  itemBuilder: (context, idx) {
                    final slide = _slides[idx];
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(32),
                          decoration: BoxDecoration(
                            color: slide['color'].withOpacity(0.08),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            slide['icon'],
                            size: 80,
                            color: slide['color'],
                          ),
                        ),
                        const SizedBox(height: 48),
                        Text(
                          slide['title'],
                          textAlign: TextAlign.center,
                          style: theme.textTheme.titleLarge?.copyWith(fontSize: 24),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          slide['desc'],
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: theme.colorScheme.onBackground.withOpacity(0.6),
                            fontSize: 15,
                            height: 1.5,
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),

              // Page indicators & CTA
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Dot indicators
                  Row(
                    children: List.generate(
                      _slides.length,
                      (index) => Container(
                        height: 8,
                        width: _currentIndex == index ? 24 : 8,
                        margin: const EdgeInsets.only(right: 6),
                        decoration: BoxDecoration(
                          color: _currentIndex == index
                              ? theme.primaryColor
                              : theme.colorScheme.outline,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  ),

                  // Action CTA
                  FloatingActionButton(
                    onPressed: () {
                      if (_currentIndex == _slides.length - 1) {
                        context.go('/auth');
                      } else {
                        _pageController.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeIn,
                        );
                      }
                    },
                    backgroundColor: theme.primaryColor,
                    foregroundColor: Colors.white,
                    child: Icon(
                      _currentIndex == _slides.length - 1
                          ? Icons.check
                          : Icons.arrow_forward,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
