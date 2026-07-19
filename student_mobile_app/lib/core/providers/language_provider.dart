import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../constants/languages.dart';

class LanguageNotifier extends StateNotifier<String> {
  final SupabaseClient _supabase = Supabase.instance.client;

  LanguageNotifier() : super(AppLanguages.defaultLanguage) {
    _loadLanguagePreference();
  }

  Future<void> _loadLanguagePreference() async {
    final user = _supabase.auth.currentUser;
    if (user != null) {
      try {
        final data = await _supabase
            .from('language_preferences')
            .select('classroom_language')
            .eq('user_id', user.id)
            .maybeSingle();
            
        if (data != null && data['classroom_language'] != null) {
          state = data['classroom_language'];
        }
      } catch (_) {
        // Fallback to default
      }
    }
  }

  Future<void> setLanguage(String newLanguage) async {
    if (!AppLanguages.supportedLanguages.contains(newLanguage)) return;
    
    state = newLanguage;
    final user = _supabase.auth.currentUser;
    if (user != null) {
      try {
        await _supabase.from('language_preferences').upsert({
          'user_id': user.id,
          'classroom_language': newLanguage,
          'app_language': newLanguage,
        });
      } catch (_) {
        // Silent failure in offline mode
      }
    }
  }
}

final languageProvider = StateNotifierProvider<LanguageNotifier, String>((ref) {
  return LanguageNotifier();
});
