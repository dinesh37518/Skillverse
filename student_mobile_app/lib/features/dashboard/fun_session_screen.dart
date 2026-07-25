import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/language_provider.dart';
import '../../core/constants/app_translations.dart';

class FunSessionScreen extends ConsumerStatefulWidget {
  const FunSessionScreen({super.key});

  @override
  ConsumerState<FunSessionScreen> createState() => _FunSessionScreenState();
}

class _FunSessionScreenState extends ConsumerState<FunSessionScreen> with SingleTickerProviderStateMixin {
  int _activeTab = 0; // 0: Mindful Breath, 1: Memory Speed Match
  
  // Breathing Timer state
  late AnimationController _breathController;
  late Animation<double> _breathAnimation;
  String _breathPhase = "Inhale... (4s)";
  Timer? _breathTimer;
  int _breathSeconds = 0;

  // Memory Speed Game State
  int _score = 0;
  int _streak = 0;
  int? _selectedFirst;
  List<Map<String, dynamic>> _cards = [];
  bool _gameCompleted = false;

  final List<Map<String, String>> _rawPairs = [
    {"term": "⚡ Voltage", "match": "Volts (V)"},
    {"term": "🔌 Current", "match": "Amperes (A)"},
    {"term": "🧲 Magnetism", "match": "Induction"},
    {"term": "💡 Resistance", "match": "Ohms (Ω)"},
  ];

  @override
  void initState() {
    super.initState();
    _initBreathing();
    _resetGame();
  }

  void _initBreathing() {
    _breathController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat(reverse: true);

    _breathAnimation = Tween<double>(begin: 0.8, end: 1.3).animate(
      CurvedAnimation(parent: _breathController, curve: Curves.easeInOut),
    );

    _breathController.addStatusListener((status) {
      if (status == AnimationStatus.forward) {
        setState(() => _breathPhase = "Inhale deeply... 🌬️");
      } else {
        setState(() => _breathPhase = "Exhale slowly... 😌");
      }
    });

    _breathTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted && _activeTab == 0) {
        setState(() => _breathSeconds++);
      }
    });
  }

  void _resetGame() {
    setState(() {
      _score = 0;
      _streak = 0;
      _selectedFirst = null;
      _gameCompleted = false;
      List<Map<String, dynamic>> items = [];
      for (int i = 0; i < _rawPairs.length; i++) {
        items.add({"id": i, "text": _rawPairs[i]["term"]!, "pairId": i, "isMatched": false, "isSelected": false});
        items.add({"id": i + 10, "text": _rawPairs[i]["match"]!, "pairId": i, "isMatched": false, "isSelected": false});
      }
      items.shuffle();
      _cards = items;
    });
  }

  void _onCardTap(int index) {
    if (_cards[index]["isMatched"] || _cards[index]["isSelected"]) return;

    setState(() {
      _cards[index]["isSelected"] = true;
    });

    if (_selectedFirst == null) {
      _selectedFirst = index;
    } else {
      int first = _selectedFirst!;
      if (_cards[first]["pairId"] == _cards[index]["pairId"]) {
        // Match found!
        setState(() {
          _cards[first]["isMatched"] = true;
          _cards[index]["isMatched"] = true;
          _cards[first]["isSelected"] = false;
          _cards[index]["isSelected"] = false;
          _score += 25;
          _streak += 1;
          _selectedFirst = null;

          if (_cards.every((c) => c["isMatched"] == true)) {
            _gameCompleted = true;
          }
        });
      } else {
        // Not a match
        Future.delayed(const Duration(milliseconds: 600), () {
          if (mounted) {
            setState(() {
              _cards[first]["isSelected"] = false;
              _cards[index]["isSelected"] = false;
              _streak = 0;
              _selectedFirst = null;
            });
          }
        });
      }
    }
  }

  @override
  void dispose() {
    _breathController.dispose();
    _breathTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(AppTranslations.translate('fun_session_title', language)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Selector Tab Switcher
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _activeTab = 0),
                      child: Container(
                        padding: const EdgeInsets.vertical(10),
                        decoration: BoxDecoration(
                          color: _activeTab == 0 ? Colors.deepPurpleAccent : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.self_improvement_rounded, size: 18, color: Colors.white),
                            SizedBox(width: 8),
                            Text('Mindful Breath', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _activeTab = 1),
                      child: Container(
                        padding: const EdgeInsets.vertical(10),
                        decoration: BoxDecoration(
                          color: _activeTab == 1 ? Colors.deepPurpleAccent : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.style_rounded, size: 18, color: Colors.white),
                            SizedBox(width: 8),
                            Text('Speed Match', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          Expanded(
            child: _activeTab == 0 ? _buildMindfulBreathingView(theme) : _buildSpeedMatchView(theme),
          ),
        ],
      ),
    );
  }

  Widget _buildMindfulBreathingView(ThemeData theme) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          '🌱 Mindful Study Reset',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.cyanAccent),
        ),
        const SizedBox(height: 8),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 32.0),
          child: Text(
            'Take a 1-minute breathing break to calm your focus, lower fatigue, and clear your mind for studying.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white60, fontSize: 13),
          ),
        ),
        const SizedBox(height: 40),

        ScaleTransition(
          scale: _breathAnimation,
          child: Container(
            width: 170,
            height: 170,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  Colors.cyanAccent.withOpacity(0.8),
                  Colors.deepPurpleAccent.withOpacity(0.5),
                  Colors.transparent,
                ],
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.cyanAccent.withOpacity(0.3),
                  blurRadius: 30,
                  spreadRadius: 10,
                )
              ],
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.spa_rounded, color: Colors.white, size: 40),
                  const SizedBox(height: 8),
                  Text(
                    '$_breathSeconds s',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 40),
        Text(
          _breathPhase,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 32),
        ElevatedButton.icon(
          onPressed: () {
            setState(() => _breathSeconds = 0);
          },
          icon: const Icon(Icons.refresh_rounded),
          label: const Text('Reset Session'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white10,
            foregroundColor: Colors.white,
          ),
        )
      ],
    );
  }

  Widget _buildSpeedMatchView(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('STUDY WELLNESS SCORE', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold)),
                  Text('$_score Pts', style: const TextStyle(color: Colors.cyanAccent, fontSize: 20, fontWeight: FontWeight.bold)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.orangeAccent.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.local_fire_department_rounded, color: Colors.orangeAccent, size: 16),
                    const SizedBox(width: 4),
                    Text('Streak: $_streak', style: const TextStyle(color: Colors.orangeAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.refresh_rounded, color: Colors.white70),
                onPressed: _resetGame,
              )
            ],
          ),
          const SizedBox(height: 16),

          if (_gameCompleted) ...[
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.emoji_events_rounded, color: Colors.amber, size: 72),
                    const SizedBox(height: 16),
                    const Text('🎉 Brain Refreshed & Ready!', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
                    const SizedBox(height: 8),
                    Text('You earned $_score wellness points! Your mind is energized for the next lesson.', textAlign: TextAlign.center, style: const TextStyle(color: Colors.white70)),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: _resetGame,
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.deepPurpleAccent),
                      child: const Text('Play Again'),
                    )
                  ],
                ),
              ),
            )
          ] else ...[
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 2.2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: _cards.length,
                itemBuilder: (context, index) {
                  final card = _cards[index];
                  final isMatched = card["isMatched"] == true;
                  final isSelected = card["isSelected"] == true;

                  Color cardBg = const Color(0xFF1E293B);
                  Border border = Border.all(color: Colors.white10);

                  if (isMatched) {
                    cardBg = Colors.emerald.withOpacity(0.2);
                    border = Border.all(color: Colors.emerald);
                  } else if (isSelected) {
                    cardBg = Colors.deepPurpleAccent.withOpacity(0.3);
                    border = Border.all(color: Colors.deepPurpleAccent, width: 2);
                  }

                  return InkWell(
                    onTap: () => _onCardTap(index),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(12),
                        border: border,
                      ),
                      child: Center(
                        child: Text(
                          card["text"],
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: isMatched ? Colors.emeraldAccent : (isSelected ? Colors.white : Colors.white70),
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            )
          ]
        ],
      ),
    );
  }
}
