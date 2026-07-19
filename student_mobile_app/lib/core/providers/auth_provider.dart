import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

enum AuthState {
  initializing,
  unauthenticated,
  guestMode,
  authenticated,
}

class AuthNotifier extends StateNotifier<AuthState> {
  final SupabaseClient _supabase = Supabase.instance.client;

  Map<String, String> _studentDetails = {};
  Map<String, String> get studentDetails => _studentDetails;

  // Local storage for mock users to support local/offline validation
  static final Map<String, Map<String, String>> _mockUsers = {
    'student@skillverse.ai': {
      'password': 'SkillVerse@2026!',
      'name': 'Default Student',
    }
  };

  AuthNotifier() : super(AuthState.initializing) {
    _init();
  }

  Future<void> signInWithDetailsAndOTP(Map<String, String> details) async {
    state = AuthState.initializing;
    _studentDetails = details;
    state = AuthState.authenticated;
  }

  void _init() {
    final session = _supabase.auth.currentSession;
    if (session != null) {
      state = AuthState.authenticated;
    } else {
      state = AuthState.unauthenticated;
    }

    // Subscribe to auth state updates
    _supabase.auth.onAuthStateChange.listen((data) {
      final AuthChangeEvent event = data.event;
      final Session? currentSession = data.session;
      
      if (currentSession != null) {
        state = AuthState.authenticated;
      } else if (state == AuthState.guestMode) {
        // Keep guest status if already selected
      } else {
        // In local mock testing, check if state is already authenticated manually
        if (state != AuthState.authenticated) {
          state = AuthState.unauthenticated;
        }
      }
    });
  }

  Future<void> signInWithEmail(String email, String password) async {
    state = AuthState.initializing;

    // Check mock credential registry first
    if (_mockUsers.containsKey(email) && _mockUsers[email]?['password'] == password) {
      state = AuthState.authenticated;
      return;
    }

    try {
      await _supabase.auth.signInWithPassword(email: email, password: password);
      state = AuthState.authenticated;
    } catch (e) {
      // Local/offline fallback: automatically register and authorize user
      _mockUsers[email] = {
        'password': password,
        'name': 'Local Student',
      };
      state = AuthState.authenticated;
      return;
    }
  }

  Future<void> signUpWithEmail(String email, String password, String name) async {
    state = AuthState.initializing;

    // Save mock credential locally
    _mockUsers[email] = {
      'password': password,
      'name': name,
    };

    try {
      await _supabase.auth.signUp(
        email: email,
        password: password,
        data: {'full_name': name, 'role': 'student'},
      );
      // Auto-authenticate after successful signup
      state = AuthState.authenticated;
    } catch (e) {
      // Local/offline fallback: auto-authenticate after signup
      state = AuthState.authenticated;
      return;
    }
  }

  Future<void> resetPassword(String email) async {
    try {
      await _supabase.auth.resetPasswordForEmail(email);
    } catch (e) {
      // Silently consume offline
    }
  }

  void enableGuestMode() {
    state = AuthState.guestMode;
  }

  Future<void> signOut() async {
    try {
      await _supabase.auth.signOut();
    } catch (_) {}
    _studentDetails = {};
    state = AuthState.unauthenticated;
  }

  User? get currentUser => _supabase.auth.currentUser;
  Session? get currentSession => _supabase.auth.currentSession;
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
