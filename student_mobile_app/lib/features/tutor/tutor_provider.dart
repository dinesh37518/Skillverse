import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/constants/languages.dart';
import '../../core/providers/language_provider.dart';

const String backendBaseUrl = kIsWeb ? 'http://localhost:8000/api/v1' : 'http://10.0.2.2:8000/api/v1';

enum AITutorMode { chat, practice }

class PracticeQuestion {
  final String topic;
  final String language;
  final String difficulty;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;
  final String emotionalPepTalk;

  PracticeQuestion({
    required this.topic,
    required this.language,
    required this.difficulty,
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
    required this.emotionalPepTalk,
  });

  factory PracticeQuestion.fromJson(Map<String, dynamic> json) {
    return PracticeQuestion(
      topic: json['topic'] ?? 'Vocational Practice',
      language: json['language'] ?? 'English',
      difficulty: json['difficulty'] ?? 'Medium',
      question: json['question'] ?? 'What is the standard procedure?',
      options: List<String>.from(json['options'] ?? []),
      correctIndex: json['correct_index'] ?? 0,
      explanation: json['explanation'] ?? '',
      emotionalPepTalk: json['emotional_pep_talk'] ?? 'Keep going!',
    );
  }
}

class AITutorState {
  final String selectedLanguage;
  final AITutorMode activeMode;
  final bool isLoading;
  final String? error;
  final List<Map<String, String>> chatMessages;
  final PracticeQuestion? currentPracticeQuestion;
  final int? selectedOptionIndex;
  final bool? isAnswerCorrect;
  final int practiceScore;
  final int totalPracticed;
  final bool isBreathingActive;
  final int breathingSecondsRemaining;

  AITutorState({
    required this.selectedLanguage,
    required this.activeMode,
    required this.isLoading,
    this.error,
    required this.chatMessages,
    this.currentPracticeQuestion,
    this.selectedOptionIndex,
    this.isAnswerCorrect,
    required this.practiceScore,
    required this.totalPracticed,
    required this.isBreathingActive,
    required this.breathingSecondsRemaining,
  });

  AITutorState copyWith({
    String? selectedLanguage,
    AITutorMode? activeMode,
    bool? isLoading,
    String? error,
    List<Map<String, String>>? chatMessages,
    PracticeQuestion? currentPracticeQuestion,
    int? selectedOptionIndex,
    bool? isAnswerCorrect,
    int? practiceScore,
    int? totalPracticed,
    bool? isBreathingActive,
    int? breathingSecondsRemaining,
  }) {
    return AITutorState(
      selectedLanguage: selectedLanguage ?? this.selectedLanguage,
      activeMode: activeMode ?? this.activeMode,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      chatMessages: chatMessages ?? this.chatMessages,
      currentPracticeQuestion: currentPracticeQuestion ?? this.currentPracticeQuestion,
      selectedOptionIndex: selectedOptionIndex ?? this.selectedOptionIndex,
      isAnswerCorrect: isAnswerCorrect ?? this.isAnswerCorrect,
      practiceScore: practiceScore ?? this.practiceScore,
      totalPracticed: totalPracticed ?? this.totalPracticed,
      isBreathingActive: isBreathingActive ?? this.isBreathingActive,
      breathingSecondsRemaining: breathingSecondsRemaining ?? this.breathingSecondsRemaining,
    );
  }
}

class AITutorNotifier extends StateNotifier<AITutorState> {
  final SupabaseClient _supabase = Supabase.instance.client;
  final Ref _ref;
  Timer? _breathingTimer;

  AITutorNotifier(this._ref, String initialLanguage)
      : super(AITutorState(
          selectedLanguage: initialLanguage,
          activeMode: AITutorMode.chat,
          isLoading: false,
          chatMessages: [
            {
              "role": "assistant",
              "content": "Namaste! I am your SkillVerse AI learning tutor. When you select a preferred language, the whole application and AI tutor adapt to that language!"
            }
          ],
          practiceScore: 0,
          totalPracticed: 0,
          isBreathingActive: false,
          breathingSecondsRemaining: 12,
        )) {
    loadPracticeQuestion("Electrical & Industrial Safety");
  }

  void updateLanguageFromGlobal(String newLanguage) {
    if (state.selectedLanguage == newLanguage) return;
    state = state.copyWith(selectedLanguage: newLanguage);

    final nativeName = AppLanguages.nativeLanguageNames[newLanguage] ?? newLanguage;
    final updatedMessages = List<Map<String, String>>.from(state.chatMessages);
    updatedMessages.add({
      "role": "assistant",
      "content": "🌐 Whole app & AI Tutor language updated to $newLanguage ($nativeName). All screens, practice drills & resources are now translated into $newLanguage!"
    });
    state = state.copyWith(chatMessages: updatedMessages);

    if (state.currentPracticeQuestion != null) {
      loadPracticeQuestion(state.currentPracticeQuestion!.topic);
    }
  }

  void setLanguage(String language) {
    if (!AppLanguages.supportedLanguages.contains(language)) return;
    
    // Update global application language provider
    _ref.read(languageProvider.notifier).setLanguage(language);
    
    updateLanguageFromGlobal(language);
  }

  void setMode(AITutorMode mode) {
    state = state.copyWith(activeMode: mode);
  }

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    final updatedMessages = List<Map<String, String>>.from(state.chatMessages);
    updatedMessages.add({"role": "user", "content": text});
    state = state.copyWith(chatMessages: updatedMessages, isLoading: true);

    try {
      final session = _supabase.auth.currentSession;
      final headers = <String, String>{'Content-Type': 'application/json'};
      if (session != null) {
        headers['Authorization'] = 'Bearer ${session.accessToken}';
      }

      final url = Uri.parse('$backendBaseUrl/ai-tutor/chat');
      final response = await http
          .post(
            url,
            headers: headers,
            body: jsonEncode({
              'session_id': 'mobile_tutor_session',
              'message': text,
              'language': state.selectedLanguage,
              'history': state.chatMessages,
            }),
          )
          .timeout(const Duration(seconds: 6));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final reply = data['reply'] ?? 'Thank you! Let us keep learning.';
        updatedMessages.add({"role": "assistant", "content": reply});
        state = state.copyWith(chatMessages: updatedMessages, isLoading: false);
      } else {
        _fallbackLocalChatReply(text);
      }
    } catch (e) {
      debugPrint("Backend AI Chat call failed ($e). Using local fallback reply.");
      _fallbackLocalChatReply(text);
    }
  }

  void _fallbackLocalChatReply(String userQuery) {
    final updatedMessages = List<Map<String, String>>.from(state.chatMessages);
    final lang = state.selectedLanguage;
    final reply = "🎓 **SkillVerse AI Tutor ($lang):**\n\n"
        "💡 **Core Concept:** Regarding '$userQuery', this is an important area in your vocational curriculum.\n\n"
        "⚙️ **Step-by-Step Breakdown:**\n"
        "1. Inspect input parameters and system isolation valves.\n"
        "2. Follow standard operational guidelines with double-check voltage testing.\n"
        "3. Review quiz questions in Practice Mode to solidify mastery!\n\n"
        "❤️ **Support:** Remember, taking deep 4-4-4 breaths helps focus your learning momentum!";

    updatedMessages.add({"role": "assistant", "content": reply});
    state = state.copyWith(chatMessages: updatedMessages, isLoading: false);
  }

  Future<void> loadPracticeQuestion(String topic) async {
    state = state.copyWith(
      isLoading: true,
      selectedOptionIndex: null,
      isAnswerCorrect: null,
    );

    try {
      final session = _supabase.auth.currentSession;
      final headers = <String, String>{'Content-Type': 'application/json'};
      if (session != null) {
        headers['Authorization'] = 'Bearer ${session.accessToken}';
      }

      final url = Uri.parse('$backendBaseUrl/ai-tutor/practice');
      final response = await http
          .post(
            url,
            headers: headers,
            body: jsonEncode({
              'topic': topic,
              'language': state.selectedLanguage,
              'difficulty': 'Medium',
            }),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        state = state.copyWith(
          isLoading: false,
          currentPracticeQuestion: PracticeQuestion.fromJson(data),
        );
      } else {
        _loadMockPracticeQuestion(topic);
      }
    } catch (e) {
      debugPrint("Backend AI Practice call failed ($e). Loading local practice drill.");
      _loadMockPracticeQuestion(topic);
    }
  }

  void _loadMockPracticeQuestion(String topic) {
    final lang = state.selectedLanguage;
    final mockQuestion = PracticeQuestion(
      topic: topic,
      language: lang,
      difficulty: 'Medium',
      question: '[$lang] What is the first safety rule when diagnosing high-voltage AC motor lines?',
      options: [
        'De-energize circuit & execute Lockout/Tagout (LOTO) verification',
        'Directly tap terminal leads using non-insulated pliers',
        'Increase current supply to force diagnostic tripping',
        'Bypass thermal overload relay manually'
      ],
      correctIndex: 0,
      explanation: 'Lockout/Tagout (LOTO) and voltage measurement are required before working on high-voltage equipment.',
      emotionalPepTalk: 'Outstanding focus! Every practice question builds your technical mastery.',
    );

    state = state.copyWith(
      isLoading: false,
      currentPracticeQuestion: mockQuestion,
    );
  }

  void selectPracticeOption(int index) {
    if (state.currentPracticeQuestion == null || state.selectedOptionIndex != null) return;

    final isCorrect = index == state.currentPracticeQuestion!.correctIndex;
    final newScore = isCorrect ? state.practiceScore + 1 : state.practiceScore;
    final newTotal = state.totalPracticed + 1;

    state = state.copyWith(
      selectedOptionIndex: index,
      isAnswerCorrect: isCorrect,
      practiceScore: newScore,
      totalPracticed: newTotal,
    );
  }

  void startBreathingExercise() {
    _breathingTimer?.cancel();
    state = state.copyWith(
      isBreathingActive: true,
      breathingSecondsRemaining: 12,
    );

    _breathingTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.breathingSecondsRemaining <= 1) {
        timer.cancel();
        state = state.copyWith(
          isBreathingActive: false,
          breathingSecondsRemaining: 12,
        );
      } else {
        state = state.copyWith(
          breathingSecondsRemaining: state.breathingSecondsRemaining - 1,
        );
      }
    });
  }

  @override
  void dispose() {
    _breathingTimer?.cancel();
    super.dispose();
  }
}

final tutorProvider = StateNotifierProvider<AITutorNotifier, AITutorState>((ref) {
  final globalLang = ref.watch(languageProvider);
  final notifier = AITutorNotifier(ref, globalLang);
  notifier.updateLanguageFromGlobal(globalLang);
  return notifier;
});
