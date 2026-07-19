import 'dart:math';
import 'package:flutter/material.dart';
import '../../widgets/custom_card.dart';

class FlashcardsScreen extends StatefulWidget {
  final String deckId;

  const FlashcardsScreen({super.key, required this.deckId});

  @override
  State<FlashcardsScreen> createState() => _FlashcardsScreenState();
}

class _FlashcardsScreenState extends State<FlashcardsScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  
  bool _showFront = true;
  int _currentIndex = 0;

  final List<Map<String, String>> _cards = [
    {
      "front": "What does Ohm's Law state?",
      "back": "Ohm's Law states that current is directly proportional to voltage and inversely proportional to resistance (I = V/R)."
    },
    {
      "front": "What is the primary function of a ground cable?",
      "back": "It provides a safe, low-resistance path for leakage/fault currents to flow into the earth, preventing electrical shocks."
    },
    {
      "front": "What is a single-phase AC induction motor?",
      "back": "An AC motor that operates on single-phase power, converting electrical energy to mechanical rotation using electromagnetic induction coils."
    }
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    _animation = Tween<double>(begin: 0.0, end: pi).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _flipCard() {
    if (_controller.isAnimating) return;
    
    if (_showFront) {
      _controller.forward().then((_) => setState(() => _showFront = false));
    } else {
      _controller.reverse().then((_) => setState(() => _showFront = true));
    }
  }

  void _nextCard() {
    if (_currentIndex < _cards.length - 1) {
      setState(() {
        _currentIndex++;
        _showFront = true;
      });
      _controller.reset();
    }
  }

  void _prevCard() {
    if (_currentIndex > 0) {
      setState(() {
        _currentIndex--;
        _showFront = true;
      });
      _controller.reset();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final card = _cards[_currentIndex];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Practice Flashcards'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Slide Count indicator
            Text(
              'Card ${_currentIndex + 1} of ${_cards.length}',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, color: Colors.white54),
            ),
            const SizedBox(height: 36),

            // Flipping Card widget
            Expanded(
              child: GestureDetector(
                onTap: _flipCard,
                child: AnimatedBuilder(
                  animation: _animation,
                  builder: (context, child) {
                    final transformValue = _animation.value;
                    final isBack = transformValue >= pi / 2;

                    return Transform(
                      transform: Matrix4.identity()
                        ..setEntry(3, 2, 0.001) // perspective transform
                        ..rotateY(transformValue),
                      alignment: Alignment.center,
                      child: isBack
                          ? Transform(
                              transform: Matrix4.identity()..rotateY(pi),
                              alignment: Alignment.center,
                              child: _buildCardSide(
                                title: 'DEFINITION',
                                text: card["back"] ?? "",
                                isFront: false,
                                theme: theme,
                              ),
                            )
                          : _buildCardSide(
                              title: 'CONCEPT DOUBT',
                              text: card["front"] ?? "",
                              isFront: true,
                              theme: theme,
                            ),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 48),

            // Controls actions button row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  onPressed: _currentIndex > 0 ? _prevCard : null,
                  color: Colors.deepPurpleAccent,
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Marked as mastered!')),
                    );
                    _nextCard();
                  },
                  icon: const Icon(Icons.check_circle_outline_rounded, color: Colors.white),
                  label: const Text('Got It', style: TextStyle(color: Colors.white)),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green[800]),
                ),
                IconButton(
                  icon: const Icon(Icons.arrow_forward_ios_rounded),
                  onPressed: _currentIndex < _cards.length - 1 ? _nextCard : null,
                  color: Colors.deepPurpleAccent,
                ),
              ],
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildCardSide({
    required String title,
    required String text,
    required bool isFront,
    required ThemeData theme,
  }) {
    return CustomCard(
      color: theme.cardColor,
      borderSide: BorderSide(color: theme.primaryColor.withOpacity(0.2), width: 1.5),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                title,
                style: TextStyle(
                  color: theme.primaryColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                text,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 18, height: 1.5),
              ),
              const SizedBox(height: 24),
              const Text(
                'Tap card to flip',
                style: TextStyle(color: Colors.white24, fontSize: 11),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
