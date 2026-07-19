import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/languages.dart';
import '../../core/providers/language_provider.dart';
import '../../core/providers/theme_provider.dart';
import '../../widgets/custom_card.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  void _showLanguageSelector(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final currentLanguage = ref.watch(languageProvider);

        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: Text(
                'Select Preferred Language',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 16),
              ),
            ),
            const Divider(color: Colors.white10),
            Expanded(
              child: ListView.builder(
                itemCount: AppLanguages.supportedLanguages.length,
                itemBuilder: (context, index) {
                  final lang = AppLanguages.supportedLanguages[index];
                  final isSelected = currentLanguage == lang;

                  return ListTile(
                    title: Text(lang),
                    trailing: isSelected ? const Icon(Icons.check_circle_rounded, color: Colors.deepPurpleAccent) : null,
                    onTap: () {
                      ref.read(languageProvider.notifier).setLanguage(lang);
                      Navigator.pop(context);
                    },
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final currentLanguage = ref.watch(languageProvider);
    final themeMode = ref.watch(themeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('App Settings'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // General Preferences
            const Text('Preferences', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white54, fontSize: 13)),
            const SizedBox(height: 10),
            CustomCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.translate_rounded, color: Colors.deepPurpleAccent),
                    title: const Text('Preferred Language', style: TextStyle(fontSize: 14)),
                    subtitle: Text(currentLanguage, style: const TextStyle(fontSize: 12)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                    onTap: () => _showLanguageSelector(context, ref),
                  ),
                  const Divider(color: Colors.white10, height: 1),
                  ListTile(
                    leading: const Icon(Icons.dark_mode_outlined, color: Colors.deepPurpleAccent),
                    title: const Text('Dark Mode Settings', style: TextStyle(fontSize: 14)),
                    trailing: Switch(
                      value: themeMode == ThemeMode.dark,
                      onChanged: (val) {
                        ref.read(themeProvider.notifier).toggleTheme();
                      },
                      activeColor: theme.primaryColor,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Notifications Switches
            const Text('Alerts & Reminders', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white54, fontSize: 13)),
            const SizedBox(height: 10),
            CustomCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  SwitchListTile(
                    secondary: const Icon(Icons.video_camera_front_outlined, color: Colors.deepPurpleAccent),
                    title: const Text('Live Class reminders', style: TextStyle(fontSize: 14)),
                    value: true,
                    onChanged: (val) {},
                    activeColor: theme.primaryColor,
                  ),
                  const Divider(color: Colors.white10, height: 1),
                  SwitchListTile(
                    secondary: const Icon(Icons.psychology_outlined, color: Colors.deepPurpleAccent),
                    title: const Text('AI tutor recommendation alerts', style: TextStyle(fontSize: 14)),
                    value: false,
                    onChanged: (val) {},
                    activeColor: theme.primaryColor,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // About details
            const Text('About Platform', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white54, fontSize: 13)),
            const SizedBox(height: 10),
            CustomCard(
              padding: EdgeInsets.zero,
              child: const Column(
                children: [
                  ListTile(
                    title: Text('App Version', style: TextStyle(fontSize: 14)),
                    trailing: Text('1.0.0 (Release Build)', style: TextStyle(color: Colors.white38, fontSize: 12)),
                  ),
                  Divider(color: Colors.white10, height: 1),
                  ListTile(
                    title: Text('Help & Support Desk', style: TextStyle(fontSize: 14)),
                    trailing: Icon(Icons.arrow_forward_ios_rounded, size: 14),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
