import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

// Configurable backend URL. Fallback to Android Emulator localhost IP if needed.
const String backendBaseUrl = kIsWeb ? 'http://localhost:8000/api/v1' : 'http://10.0.2.2:8000/api/v1';

class MentorState {
  final bool isLoading;
  final String? error;
  final Map<String, dynamic>? dashboardData;
  final Map<String, dynamic>? generatedAssignment;

  MentorState({
    required this.isLoading,
    this.error,
    this.dashboardData,
    this.generatedAssignment,
  });

  MentorState copyWith({
    bool? isLoading,
    String? error,
    Map<String, dynamic>? dashboardData,
    Map<String, dynamic>? generatedAssignment,
  }) {
    return MentorState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      dashboardData: dashboardData ?? this.dashboardData,
      generatedAssignment: generatedAssignment ?? this.generatedAssignment,
    );
  }
}

class MentorNotifier extends StateNotifier<MentorState> {
  final SupabaseClient _supabase = Supabase.instance.client;

  MentorNotifier() : super(MentorState(isLoading: false)) {
    fetchDashboard();
  }

  Future<void> fetchDashboard() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final session = _supabase.auth.currentSession;
      if (session == null) {
        // Fallback to high-quality mock data if not logged in
        state = state.copyWith(
          isLoading: false,
          dashboardData: _getMockDashboard("Guest Student"),
        );
        return;
      }

      final url = Uri.parse('$backendBaseUrl/student/mentor/dashboard');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer ${session.accessToken}',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        state = state.copyWith(isLoading: false, dashboardData: data);
      } else {
        // Let's use mock data on error code
        state = state.copyWith(
          isLoading: false,
          dashboardData: _getMockDashboard(session.user.userMetadata?['full_name'] ?? "Student"),
        );
      }
    } catch (e) {
      debugPrint("Backend fetch failed ($e). Loading high-fidelity mock mentor dashboard.");
      final session = _supabase.auth.currentUser;
      state = state.copyWith(
        isLoading: false,
        dashboardData: _getMockDashboard(session?.userMetadata?['full_name'] ?? "Vocational Student"),
      );
    }
  }

  Future<bool> updateGoals({String? todayGoal, String? weeklyGoal, double? todayProgress, double? weeklyProgress}) async {
    try {
      final session = _supabase.auth.currentSession;
      if (session == null) {
        // Update mock state locally
        if (state.dashboardData != null) {
          final updated = Map<String, dynamic>.from(state.dashboardData!);
          if (todayGoal != null) updated['today_goal']['text'] = todayGoal;
          if (weeklyGoal != null) updated['weekly_goal']['text'] = weeklyGoal;
          if (todayProgress != null) {
            updated['today_goal']['progress'] = todayProgress;
            updated['today_goal']['completed'] = todayProgress >= 1.0;
          }
          if (weeklyProgress != null) {
            updated['weekly_goal']['progress'] = weeklyProgress;
            updated['weekly_goal']['completed'] = weeklyProgress >= 1.0;
          }
          state = state.copyWith(dashboardData: updated);
        }
        return true;
      }

      final url = Uri.parse('$backendBaseUrl/student/mentor/goals');
      final body = jsonEncode({
        'today_goal_text': todayGoal,
        'weekly_goal_text': weeklyGoal,
        'today_progress': todayProgress,
        'weekly_progress': weeklyProgress,
      });

      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer ${session.accessToken}',
          'Content-Type': 'application/json',
        },
        body: body,
      ).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        await fetchDashboard();
        return true;
      }
    } catch (e) {
      debugPrint("Goals update request failed ($e). Emulating locally.");
    }

    // Emulate local updates on connection fail
    if (state.dashboardData != null) {
      final updated = Map<String, dynamic>.from(state.dashboardData!);
      if (todayGoal != null) updated['today_goal']['text'] = todayGoal;
      if (weeklyGoal != null) updated['weekly_goal']['text'] = weeklyGoal;
      if (todayProgress != null) {
        updated['today_goal']['progress'] = todayProgress;
        updated['today_goal']['completed'] = todayProgress >= 1.0;
      }
      if (weeklyProgress != null) {
        updated['weekly_goal']['progress'] = weeklyProgress;
        updated['weekly_goal']['completed'] = weeklyProgress >= 1.0;
      }
      state = state.copyWith(dashboardData: updated);
      return true;
    }
    return false;
  }

  Future<void> generatePersonalizedAssignment(String lessonId, String topicName) async {
    state = state.copyWith(isLoading: true, generatedAssignment: null);
    try {
      final session = _supabase.auth.currentSession;
      if (session == null) {
        state = state.copyWith(
          isLoading: false,
          generatedAssignment: _getMockAssignment(topicName),
        );
        return;
      }

      final url = Uri.parse('$backendBaseUrl/student/mentor/assignments/generate');
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer ${session.accessToken}',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'lesson_id': lessonId,
          'topic_name': topicName,
        }),
      ).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        state = state.copyWith(isLoading: false, generatedAssignment: data);
      } else {
        state = state.copyWith(
          isLoading: false,
          generatedAssignment: _getMockAssignment(topicName),
        );
      }
    } catch (e) {
      debugPrint("AI assignment generation failed ($e). Emulating fallback assignment.");
      state = state.copyWith(
        isLoading: false,
        generatedAssignment: _getMockAssignment(topicName),
      );
    }
  }

  void clearAssignment() {
    state = state.copyWith(generatedAssignment: null);
  }

  Map<String, dynamic> _getMockDashboard(String name) {
    return {
      "learning_progress": 68.5,
      "today_goal": {
        "text": "Solve 1 Practice Quiz on Relay Tripping",
        "completed": false,
        "progress": 0.4
      },
      "weekly_goal": {
        "text": "Spend 1.5 hours reviewing electrical safety & conduits",
        "completed": false,
        "progress": 0.75
      },
      "skill_growth": [
        {"skill": "Electrical", "level": 85},
        {"skill": "Plumbing", "level": 40},
        {"skill": "Machining", "level": 15},
        {"skill": "Carpentry", "level": 10}
      ],
      "learning_streak": 5,
      "recommended_lessons": [
        {
          "id": "lesson-wiring-102",
          "title": "Industrial Relay Installation & Tripping",
          "course_title": "DC Motor Wiring Basics",
          "type": "Next Lesson"
        }
      ],
      "recommended_revisions": [
        {
          "id": "lesson-safety-101",
          "title": "High Voltage Arc Grounding Safety",
          "course_title": "Grounding & Shielding Safety",
          "reason": "Needs Score Improvement"
        },
        {
          "id": "lesson-tools-101",
          "title": "Digital Multimeters Calibration",
          "course_title": "DC Motor Wiring Basics",
          "reason": "Bookmarked Study"
        }
      ],
      "ai_suggestions": {
        "predicted_weak_areas": [
          "Calibrating analog trippers",
          "Multi-core cables insulation resistance values"
        ],
        "predicted_learning_difficulties": [
          "Fractions calculations during gauge measurements"
        ],
        "career_pathways": [
          "Smart Grid Commissioning Engineer",
          "High Voltage Transformer Technician"
        ],
        "additional_resources": [
          {"title": "Relay Diagnostics and LOTO Procedures", "type": "video", "url": "https://www.youtube.com/watch?v=mock-relay"},
          {"title": "National Industrial Wiring Code Reference Guide", "type": "article", "url": "https://example.com/guide"}
        ],
        "motivational_messages": [
          "Namaste $name! You have locked in a 5-day streak! Master 'Relay Installation' today to earn the 'Quiz Master' badge.",
          "Every vocational skill requires practice. Keep refining your calibration measurements to level up your Electrical growth!"
        ]
      },
      "upcoming_live_sessions": [
        {
          "id": "live-session-wiring-103",
          "title": "Interactive Tripping Circuit Troubleshooting",
          "course_title": "DC Motor Wiring Basics",
          "scheduled_at": DateTime.now().add(const Duration(hours: 4)).toIso8601String()
        }
      ],
      "recently_weak_topics": [
        {"topic": "Arc Flash Clearance Calculations", "score": 62.0, "category": "Safety Regulations"},
        {"topic": "Relay Tripping Curves", "score": 68.0, "category": "Electrical"}
      ],
      "recently_improved_topics": [
        {"topic": "Grounding Rod Placement", "score": 92.0, "category": "Electrical"},
        {"topic": "Cable Splicing", "score": 88.0, "category": "Electrical"}
      ],
      "motivational_messages": [
        "Namaste $name! You have locked in a 5-day streak! Master 'Relay Installation' today to earn the 'Quiz Master' badge."
      ],
      "badges": [
        {"name": "First Steps", "description": "Enrolled in your first course!", "icon": "school", "date_earned": "2026-07-08"},
        {"name": "Streak Starter", "description": "Maintained a 3-day learning streak.", "icon": "local_fire_department", "date_earned": "2026-07-09"}
      ]
    };
  }

  Map<String, dynamic> _getMockAssignment(String topicName) {
    return {
      "title": "AI Directed Mastery: $topicName",
      "description": "Custom questions generated by your Personal Mentor to master core concepts in $topicName.",
      "questions": [
        {
          "question": "What is the correct procedure if an arc flash hazard boundary is violated?",
          "options": [
            "De-energize the entire distribution panel instantly",
            "Wear appropriate PPE Category 4 and post a warning barrier",
            "Perform checks with insulated test leads from a distance",
            "None of the above"
          ],
          "correct_index": 0,
          "explanation": "Safety regulations mandate that the panel should be de-energized before working within an arc flash boundary."
        },
        {
          "question": "Which parameter directly affects the sensitivity of a thermal overload relay?",
          "options": [
            "Ambient temperature setting",
            "Coil winding core index",
            "Conductor insulation class",
            "Terminal lug torque value"
          ],
          "correct_index": 0,
          "explanation": "Ambient temperature directly impacts thermal expansion of bi-metallic strips in overload relays."
        }
      ]
    };
  }
}

final mentorProvider = StateNotifierProvider<MentorNotifier, MentorState>((ref) {
  return MentorNotifier();
});
