import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/languages.dart';
import 'tutor_provider.dart';

class AITutorScreen extends ConsumerStatefulWidget {
  const AITutorScreen({super.key});

  @override
  ConsumerState<AITutorScreen> createState() => _AITutorScreenState();
}

class _AITutorScreenState extends ConsumerState<AITutorScreen> {
  final _chatController = TextEditingController();
  final List<String> _quickTopics = [
    "Electrical Safety & Tripping",
    "Transformer Grounding",
    "Digital Multimeter Calibration",
    "Hydraulics & Pressure Valves",
    "Solar PV Inverter MPPT",
  ];

  @override
  void dispose() {
    _chatController.dispose();
    super.dispose();
  }

  void _showLanguageSelector(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final currentLang = ref.read(tutorProvider).selectedLanguage;
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Select Preferred Language (23 Active)',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  )
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Selecting a preferred language translates the whole application UI, AI Tutor, practice drills & 23-language knowledge resources:',
                style: TextStyle(fontSize: 13, color: Colors.grey),
              ),
              const SizedBox(height: 12),
              Flexible(
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: AppLanguages.supportedLanguages.length,
                  itemBuilder: (context, index) {
                    final lang = AppLanguages.supportedLanguages[index];
                    final nativeName = AppLanguages.nativeLanguageNames[lang] ?? lang;
                    final isSelected = lang == currentLang;

                    return ListTile(
                      dense: true,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      tileColor: isSelected
                          ? Theme.of(context).primaryColor.withOpacity(0.15)
                          : null,
                      leading: Icon(
                        Icons.translate_rounded,
                        color: isSelected ? Theme.of(context).primaryColor : Colors.grey,
                      ),
                      title: Text(
                        lang,
                        style: TextStyle(
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          color: isSelected ? Theme.of(context).primaryColor : null,
                        ),
                      ),
                      trailing: Text(
                        nativeName,
                        style: const TextStyle(fontSize: 14, color: Colors.deepPurpleAccent),
                      ),
                      onTap: () {
                        ref.read(tutorProvider.notifier).setLanguage(lang);
                        Navigator.pop(context);
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(tutorProvider);
    final notifier = ref.read(tutorProvider.notifier);
    final theme = Theme.of(context);
    final selectedNative = AppLanguages.nativeLanguageNames[state.selectedLanguage] ?? state.selectedLanguage;

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Learning Tutor & Practice'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          // Preferred Language Selector Chip
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: ActionChip(
              avatar: const Icon(Icons.language_rounded, size: 16, color: Colors.deepPurpleAccent),
              label: Text(
                '${state.selectedLanguage} ($selectedNative)',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
              ),
              backgroundColor: theme.cardColor,
              onPressed: () => _showLanguageSelector(context),
            ),
          )
        ],
      ),
      body: Column(
        children: [
          // 23-Language Knowledge Bank Header Banner
          Container(
            width: double.infinity,
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.deepPurple.shade900.withOpacity(0.8),
                  Colors.indigo.shade800.withOpacity(0.8),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.deepPurpleAccent.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.psychology_rounded, color: Colors.amberAccent, size: 24),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '23-Language Knowledge Bank Active (${state.selectedLanguage})',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const Text(
                        'Emotional Intelligence & Subject Mastery Tutor connected',
                        style: TextStyle(color: Colors.white70, fontSize: 11),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.self_improvement_rounded, color: Colors.tealAccent),
                  tooltip: '4-4-4 Breathing Check-in',
                  onPressed: () => notifier.startBreathingExercise(),
                )
              ],
            ),
          ),

          // 4-4-4 Breathing Exercise Active Banner
          if (state.isBreathingActive)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.teal.shade900.withOpacity(0.85),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2.5, valueColor: AlwaysStoppedAnimation(Colors.tealAccent)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          '🫁 4-4-4 Box Breathing Check-in',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        Text(
                          'Inhale (4s) ➔ Hold (4s) ➔ Exhale (4s). Remaining: ${state.breathingSecondsRemaining}s',
                          style: const TextStyle(color: Colors.white70, fontSize: 11),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),

          // Mode Toggle Bar (Chat vs Interactive Practice)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Container(
              height: 42,
              decoration: BoxDecoration(
                color: theme.cardColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: theme.colorScheme.outline),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => notifier.setMode(AITutorMode.chat),
                      child: Container(
                        decoration: BoxDecoration(
                          color: state.activeMode == AITutorMode.chat
                              ? theme.primaryColor
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Center(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.chat_bubble_outline_rounded,
                                size: 16,
                                color: state.activeMode == AITutorMode.chat ? Colors.white : Colors.grey,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'AI Tutor Doubts',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: state.activeMode == AITutorMode.chat ? Colors.white : Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => notifier.setMode(AITutorMode.practice),
                      child: Container(
                        decoration: BoxDecoration(
                          color: state.activeMode == AITutorMode.practice
                              ? theme.primaryColor
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Center(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.quiz_outlined,
                                size: 16,
                                color: state.activeMode == AITutorMode.practice ? Colors.white : Colors.grey,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Practice Drill (${state.practiceScore}/${state.totalPracticed})',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: state.activeMode == AITutorMode.practice ? Colors.white : Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Main View Content based on selected mode
          Expanded(
            child: state.activeMode == AITutorMode.chat
                ? _buildChatBody(context, state, notifier, theme)
                : _buildPracticeBody(context, state, notifier, theme),
          ),
        ],
      ),
    );
  }

  Widget _buildChatBody(
    BuildContext context,
    AITutorState state,
    AITutorNotifier notifier,
    ThemeData theme,
  ) {
    return Column(
      children: [
        // Quick Prompts list at top
        if (state.chatMessages.length <= 2)
          SizedBox(
            height: 38,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _quickTopics.length,
              itemBuilder: (context, index) {
                return Container(
                  margin: const EdgeInsets.only(right: 8),
                  child: ActionChip(
                    label: Text(_quickTopics[index], style: const TextStyle(fontSize: 12)),
                    onPressed: () => notifier.sendMessage("Explain ${_quickTopics[index]} in depth"),
                    backgroundColor: theme.cardColor,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                );
              },
            ),
          ),

        // Message log stream
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: state.chatMessages.length,
            itemBuilder: (context, index) {
              final m = state.chatMessages[index];
              final isUser = m["role"] == "user";

              return Align(
                alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isUser ? theme.primaryColor : theme.cardColor,
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(16),
                      topRight: const Radius.circular(16),
                      bottomLeft: isUser ? const Radius.circular(16) : Radius.zero,
                      bottomRight: isUser ? Radius.zero : const Radius.circular(16),
                    ),
                    border: isUser ? null : Border.all(color: theme.colorScheme.outline),
                  ),
                  constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.82),
                  child: Text(
                    m["content"] ?? "",
                    style: TextStyle(
                      fontSize: 14,
                      color: isUser ? Colors.white : theme.textTheme.bodyMedium?.color,
                      height: 1.4,
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        // Typing Loader bubble
        if (state.isLoading)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Row(
                children: [
                  const SizedBox(
                    width: 14,
                    height: 14,
                    child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(Colors.deepPurpleAccent)),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Tutor is retrieving 23-language resource context & composing answer...',
                    style: TextStyle(fontSize: 12, color: theme.primaryColor),
                  ),
                ],
              ),
            ),
          ),

        // Input Toolbar at bottom
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: theme.scaffoldBackgroundColor,
            border: Border(top: BorderSide(color: theme.colorScheme.outline)),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _chatController,
                  onSubmitted: (val) {
                    notifier.sendMessage(val);
                    _chatController.clear();
                  },
                  style: const TextStyle(fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'Ask doubt in ${state.selectedLanguage}...',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.send_rounded, color: Colors.deepPurpleAccent),
                onPressed: () {
                  notifier.sendMessage(_chatController.text);
                  _chatController.clear();
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPracticeBody(
    BuildContext context,
    AITutorState state,
    AITutorNotifier notifier,
    ThemeData theme,
  ) {
    if (state.isLoading && state.currentPracticeQuestion == null) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    final q = state.currentPracticeQuestion;
    if (q == null) {
      return Center(
        child: ElevatedButton.icon(
          onPressed: () => notifier.loadPracticeQuestion("Electrical Safety"),
          icon: const Icon(Icons.refresh_rounded),
          label: const Text('Load Practice Question'),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Topic selector chips
          SizedBox(
            height: 38,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _quickTopics.length,
              itemBuilder: (context, index) {
                final topic = _quickTopics[index];
                final isSelected = topic.toLowerCase() == q.topic.toLowerCase();
                return Container(
                  margin: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    selected: isSelected,
                    label: Text(topic, style: const TextStyle(fontSize: 12)),
                    onSelected: (selected) {
                      if (selected) notifier.loadPracticeQuestion(topic);
                    },
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 16),

          // Question Card
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.deepPurpleAccent.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${q.topic} • ${q.difficulty}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.deepPurpleAccent,
                          ),
                        ),
                      ),
                      Text(
                        'Language: ${state.selectedLanguage}',
                        style: const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(
                    q.question,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, height: 1.4),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Options List
          ...List.generate(q.options.length, (index) {
            final optionText = q.options[index];
            final isSelected = state.selectedOptionIndex == index;
            final isCorrectAnswer = index == q.correctIndex;
            final isAnswered = state.selectedOptionIndex != null;

            Color optionColor = theme.cardColor;
            Color borderColor = theme.colorScheme.outline;

            if (isAnswered) {
              if (isCorrectAnswer) {
                optionColor = Colors.green.shade900.withOpacity(0.3);
                borderColor = Colors.greenAccent;
              } else if (isSelected) {
                optionColor = Colors.red.shade900.withOpacity(0.3);
                borderColor = Colors.redAccent;
              }
            }

            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              child: InkWell(
                onTap: isAnswered ? null : () => notifier.selectPracticeOption(index),
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: optionColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: borderColor, width: isSelected || (isAnswered && isCorrectAnswer) ? 2 : 1),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 14,
                        backgroundColor: isAnswered
                            ? (isCorrectAnswer ? Colors.green : (isSelected ? Colors.red : Colors.grey.shade800))
                            : theme.primaryColor.withOpacity(0.2),
                        child: Text(
                          String.fromCharCode(65 + index),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: isAnswered ? Colors.white : theme.primaryColor,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          optionText,
                          style: const TextStyle(fontSize: 14, height: 1.3),
                        ),
                      ),
                      if (isAnswered && isCorrectAnswer)
                        const Icon(Icons.check_circle_rounded, color: Colors.greenAccent, size: 20),
                      if (isAnswered && isSelected && !isCorrectAnswer)
                        const Icon(Icons.cancel_rounded, color: Colors.redAccent, size: 20),
                    ],
                  ),
                ),
              ),
            );
          }),

          // Feedback & Explanation Card
          if (state.selectedOptionIndex != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: state.isAnswerCorrect == true
                    ? Colors.green.shade900.withOpacity(0.2)
                    : Colors.amber.shade900.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: state.isAnswerCorrect == true ? Colors.green : Colors.amber,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        state.isAnswerCorrect == true
                            ? Icons.thumb_up_alt_rounded
                            : Icons.tips_and_updates_rounded,
                        color: state.isAnswerCorrect == true ? Colors.greenAccent : Colors.amberAccent,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        state.isAnswerCorrect == true ? 'Correct! Excellent work!' : 'Pedagogical Explanation:',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    q.explanation,
                    style: const TextStyle(fontSize: 13, height: 1.4),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '❤️ Tutor Encouragement: ${q.emotionalPepTalk}',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.deepPurpleAccent),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 46,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.primaryColor,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () => notifier.loadPracticeQuestion(q.topic),
                icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white),
                label: const Text(
                  'Next Practice Question',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            )
          ]
        ],
      ),
    );
  }
}
