import 'package:flutter/material.dart';
import '../../widgets/custom_card.dart';
import '../../widgets/custom_button.dart';

class QuizScreen extends StatefulWidget {
  final String quizId;

  const QuizScreen({super.key, required this.quizId});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _currentQuestionIndex = 0;
  int _selectedOptionIndex = -1;
  int _score = 0;
  bool _isAnswered = false;
  bool _showResults = false;

  final List<Map<String, dynamic>> _questions = [
    {
      "question": "What is the formula derived from Ohm's Law to calculate current?",
      "options": ["I = V * R", "I = V / R", "I = R / V", "I = V + R"],
      "correctIndex": 1
    },
    {
      "question": "Which of these is the main safety role of a grounding conductor?",
      "options": [
        "Increase voltage capacity",
        "Control current flow direction",
        "Disperse leakage currents safely into the earth",
        "Filter electromagnetic noise"
      ],
      "correctIndex": 2
    },
    {
      "question": "Which wire color typically represents ground in modern AC systems?",
      "options": ["Red", "Black", "Blue", "Green or Green/Yellow"],
      "correctIndex": 3
    }
  ];

  void _submitAnswer(int index) {
    if (_isAnswered) return;
    setState(() {
      _selectedOptionIndex = index;
      _isAnswered = true;
      if (index == _questions[_currentQuestionIndex]["correctIndex"]) {
        _score++;
      }
    });
  }

  void _nextQuestion() {
    if (_currentQuestionIndex < _questions.length - 1) {
      setState(() {
        _currentQuestionIndex++;
        _selectedOptionIndex = -1;
        _isAnswered = false;
      });
    } else {
      setState(() => _showResults = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_showResults) {
      return Scaffold(
        appBar: AppBar(title: const Text('Quiz Results'), automaticallyImplyLeading: false),
        body: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              CustomCard(
                child: Column(
                  children: [
                    const Icon(Icons.emoji_events_rounded, size: 72, color: Colors.amber),
                    const SizedBox(height: 16),
                    const Text('Congratulations!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22)),
                    const SizedBox(height: 8),
                    Text(
                      'You scored $_score out of ${_questions.length}',
                      style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold, fontSize: 18),
                    ),
                    const SizedBox(height: 24),
                    const Text('Leaderboard ranking updated: Rank #4.', style: TextStyle(color: Colors.white54, fontSize: 13)),
                  ],
                ),
              ),
              const SizedBox(height: 36),
              CustomButton(
                text: 'Back to Home',
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
        ),
      );
    }

    final question = _questions[_currentQuestionIndex];

    return Scaffold(
      appBar: AppBar(
        title: Text('Question ${_currentQuestionIndex + 1} of ${_questions.length}'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Timeline progress indicator bar
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: (_currentQuestionIndex + 1) / _questions.length,
                backgroundColor: Colors.white10,
                valueColor: AlwaysStoppedAnimation<Color>(theme.primaryColor),
              ),
            ),
            const SizedBox(height: 32),

            // Question Card box
            CustomCard(
              child: Text(
                question["question"] ?? "",
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, height: 1.4),
              ),
            ),
            const SizedBox(height: 24),

            // Answers Option List
            Expanded(
              child: ListView.builder(
                itemCount: (question["options"] as List).length,
                itemBuilder: (context, index) {
                  final optionText = question["options"][index];
                  Color optionColor = theme.cardColor;
                  BorderSide? border;

                  if (_isAnswered) {
                    if (index == question["correctIndex"]) {
                      optionColor = Colors.green[900]!.withOpacity(0.2);
                      border = BorderSide(color: Colors.green[500]!);
                    } else if (index == _selectedOptionIndex) {
                      optionColor = Colors.red[900]!.withOpacity(0.2);
                      border = BorderSide(color: Colors.red[500]!);
                    }
                  }

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: CustomCard(
                      onTap: () => _submitAnswer(index),
                      color: optionColor,
                      borderSide: border,
                      child: Row(
                        children: [
                          Container(
                            height: 32,
                            width: 32,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.04),
                              shape: BoxShape.circle,
                            ),
                            child: Text(
                              String.fromCharCode(65 + index),
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(optionText, style: const TextStyle(fontSize: 14)),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            if (_isAnswered)
              CustomButton(
                text: _currentQuestionIndex == _questions.length - 1 ? 'Finish Quiz' : 'Next Question',
                onPressed: _nextQuestion,
              ),
          ],
        ),
      ),
    );
  }
}
