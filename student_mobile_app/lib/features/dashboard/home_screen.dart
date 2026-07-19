import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/language_provider.dart';
import '../../widgets/custom_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);
    final userLanguage = ref.watch(languageProvider);
    final isGuest = authState == AuthState.guestMode;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isGuest ? 'Welcome Guest' : 'Hello Student',
              style: theme.textTheme.titleLarge?.copyWith(fontSize: 18),
            ),
            Text(
              'Preferred language: $userLanguage',
              style: const TextStyle(fontSize: 12, color: Colors.white54),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () => context.push('/notifications'),
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => context.push('/settings'),
          ),
        ],
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Daily Learning Goal Card
            CustomCard(
              color: theme.primaryColor.withOpacity(0.08),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Daily Learning Goal',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Spend 15 mins reviewing blueprints today',
                          style: TextStyle(color: Colors.white60, fontSize: 13),
                        ),
                        const SizedBox(height: 12),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: const LinearProgressIndicator(
                            value: 0.6,
                            backgroundColor: Colors.white10,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.deepPurpleAccent),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 20),
                  const Stack(
                    alignment: Alignment.center,
                    children: [
                      SizedBox(
                        height: 54,
                        width: 54,
                        child: CircularProgressIndicator(
                          value: 0.6,
                          backgroundColor: Colors.white10,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.deepPurpleAccent),
                        ),
                      ),
                      Text('60%', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Live Lecture Notification Alert
            CustomCard(
              color: Colors.redAccent.withOpacity(0.06),
              borderSide: BorderSide(color: Colors.redAccent.withOpacity(0.2)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.redAccent,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'LIVE NOW',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Instant audio translation ready',
                        style: TextStyle(fontSize: 12, color: Colors.white60),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Hydraulic Control Valves Vetting Class',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  CustomButtonHome(
                    text: 'Join Instantly',
                    onPressed: () => context.push('/classroom/mock-hydraulic-live-101'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),

            // Vocational Category Chips List
            const SectionHeader(title: 'Vocational Branches'),
            const SizedBox(height: 12),
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _categoryChip(Icons.flash_on_rounded, 'Electrical', theme),
                  _categoryChip(Icons.plumbing_rounded, 'Plumbing', theme),
                  _categoryChip(Icons.build_rounded, 'Machining', theme),
                  _categoryChip(Icons.handyman_rounded, 'Carpentry', theme),
                ],
              ),
            ),
            const SizedBox(height: 28),

            // Resume Learning List
            const SectionHeader(title: 'Continue Learning'),
            const SizedBox(height: 12),
            CustomCard(
              onTap: () => context.push('/video/lesson-valves-101'),
              child: Row(
                children: [
                  Container(
                    height: 50,
                    width: 50,
                    decoration: BoxDecoration(
                      color: theme.primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(Icons.play_arrow_rounded, color: theme.primaryColor),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Pressure Valve Checks', style: TextStyle(fontWeight: FontWeight.bold)),
                        Text('Lesson 3 of Valve Routing • 45% done', style: TextStyle(color: Colors.white54, fontSize: 12)),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                ],
              ),
            ),
            const SizedBox(height: 28),

            // Recommended Courses Feed
            const SectionHeader(title: 'Recommended for You'),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              childAspectRatio: 0.85,
              children: [
                _courseItemCard('Electric Motor Installation', 'Electrical', '6 lessons', 'course-1', theme, context),
                _courseItemCard('Blueprint Reading Basics', 'General', '10 lessons', 'course-2', theme, context),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _categoryChip(IconData icon, String label, ThemeData theme) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: FilterChip(
        avatar: Icon(icon, size: 16, color: theme.primaryColor),
        label: Text(label),
        onSelected: (_) {},
        backgroundColor: theme.cardColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _courseItemCard(
    String title,
    String category,
    String lessons,
    String id,
    ThemeData theme,
    BuildContext context,
  ) {
    return CustomCard(
      padding: EdgeInsets.zero,
      onTap: () => context.push('/course/$id'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            flex: 4,
            child: Container(
              decoration: BoxDecoration(
                color: theme.primaryColor.withOpacity(0.1),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              ),
              child: Icon(Icons.school_rounded, color: theme.primaryColor, size: 36),
            ),
          ),
          Expanded(
            flex: 5,
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    category,
                    style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                  Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, height: 1.2),
                  ),
                  Text(
                    lessons,
                    style: const TextStyle(color: Colors.white54, fontSize: 11),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class SectionHeader extends StatelessWidget {
  final String title;

  const SectionHeader({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 18),
        ),
        TextButton(
          onPressed: () {},
          child: const Text('See All', style: TextStyle(color: Colors.deepPurpleAccent, fontSize: 13)),
        ),
      ],
    );
  }
}

class CustomButtonHome extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const CustomButtonHome({super.key, required this.text, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.redAccent,
      borderRadius: BorderRadius.circular(8),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 12),
          alignment: Alignment.center,
          child: Text(
            text,
            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14),
          ),
        ),
      ),
    );
  }
}
