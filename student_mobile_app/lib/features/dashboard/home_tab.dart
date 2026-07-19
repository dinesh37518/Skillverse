import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final user = Supabase.instance.client.auth.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('SkillVerse AI', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Section
            Text(
              user != null ? 'Welcome Back, Student!' : 'Welcome to SkillVerse!',
              style: theme.textTheme.titleLarge?.copyWith(fontSize: 24),
            ),
            Text(
              user != null ? 'Resume your learning tracks' : 'Log in to save your learning progress',
              style: const TextStyle(color: Colors.white60, fontSize: 14),
            ),
            const SizedBox(height: 24),

            // Live Class Banner (Join Class Trigger)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Colors.violet, Colors.indigo],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.redAccent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text('LIVE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      ),
                      const SizedBox(width: 8),
                      const Text('Active Multilingual Lecture', style: TextStyle(color: Colors.white70)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Electrical Controls & Motor Installation',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Translating instantly into your preferred language.',
                    style: TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.push('/classroom/mock-session-id-101'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.violet,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text('Join Classroom'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Analyze Video URL Launcher Card
            InkWell(
              onTap: () => context.push('/video-analysis'),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.cyanAccent.withOpacity(0.15)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.cyanAccent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.video_library_rounded, color: Colors.cyanAccent, size: 28),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Analyze Video URL',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Generate AI notes, revision guides, study flashcards & practice test quizzes from any web video.',
                            style: TextStyle(color: Colors.white54, fontSize: 11, height: 1.3),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white54, size: 14),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Categories Section
            Text('Vocational Categories', style: theme.textTheme.titleLarge),
            const SizedBox(height: 12),
            SizedBox(
              height: 100,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _categoryCard(Icons.electrical_services, 'Electrical'),
                  _categoryCard(Icons.plumbing, 'Plumbing'),
                  _categoryCard(Icons.precision_manufacturing, 'Machinist'),
                  _categoryCard(Icons.carpenter, 'Carpentry'),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Featured Courses List
            Text('Featured Courses', style: theme.textTheme.titleLarge),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 2,
              itemBuilder: (context, index) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(12),
                    leading: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.violet.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.menu_book, color: Colors.deepPurpleAccent),
                    ),
                    title: Text(index == 0 ? 'DC Motor Wiring Basics' : 'Grounding & Shielding Safety'),
                    subtitle: Text(index == 0 ? 'Electrical | 6 lessons' : 'Safety Regulations | 4 lessons'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {},
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _categoryCard(IconData icon, String title) {
    return Container(
      width: 100,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: Colors.deepPurpleAccent, size: 32),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
