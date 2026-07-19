import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';
import 'core/providers/theme_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase Client
  await Supabase.initialize(
    url: 'https://mock-supabase-url.supabase.co',
    anonKey: 'mock-anon-key-placeholder-for-compilation',
  );

  runApp(
    const ProviderScope(
      child: SkillVerseStudentApp(),
    ),
  );
}

class SkillVerseStudentApp extends ConsumerWidget {
  const SkillVerseStudentApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final themeMode = ref.watch(themeProvider);

    return MaterialApp.router(
      title: 'SkillVerse AI',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
