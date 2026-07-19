import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../widgets/custom_card.dart';
import '../../widgets/custom_button.dart';

class CourseDetailsScreen extends ConsumerStatefulWidget {
  final String courseId;

  const CourseDetailsScreen({super.key, required this.courseId});

  @override
  ConsumerState<CourseDetailsScreen> createState() => _CourseDetailsScreenState();
}

class _CourseDetailsScreenState extends ConsumerState<CourseDetailsScreen> {
  bool _isEnrolled = false;

  final List<Map<String, dynamic>> _syllabus = [
    {
      "section": "1. Safety Basics & Grounding Rules",
      "lessons": [
        {"title": "Ohm's Law & Circuit Calculations", "duration": "12 mins", "id": "1"},
        {"title": "Tracing Terminal Ground Lines", "duration": "18 mins", "id": "2"},
      ]
    },
    {
      "section": "2. Installing Single-Phase AC Motors",
      "lessons": [
        {"title": "Understanding Coil Wiring Systems", "duration": "15 mins", "id": "3"},
        {"title": "Testing Voltage Tolerances", "duration": "20 mins", "id": "4"},
      ]
    }
  ];

  void _handleEnrollment() {
    final authState = ref.read(authProvider);

    if (authState == AuthState.guestMode) {
      // Enforce auth redirect for enrollment
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please sign in to enroll and save your progress.')),
      );
      context.push('/auth');
    } else {
      setState(() => _isEnrolled = true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Course enrollment completed successfully!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Course Specifications'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Course Thumbnail frame placeholder
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: theme.primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: theme.colorScheme.outline),
              ),
              child: Icon(Icons.school_rounded, color: theme.primaryColor, size: 64),
            ),
            const SizedBox(height: 20),

            // Category & Metadata
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: theme.primaryColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'Electrical',
                    style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
                const SizedBox(width: 12),
                const Icon(Icons.timer_outlined, size: 14, color: Colors.white60),
                const SizedBox(width: 4),
                const Text('4.5 Hours', style: TextStyle(color: Colors.white60, fontSize: 12)),
                const SizedBox(width: 12),
                const Icon(Icons.translate_outlined, size: 14, color: Colors.white60),
                const SizedBox(width: 4),
                const Text('Hindi + 22 languages', style: TextStyle(color: Colors.white60, fontSize: 12)),
              ],
            ),
            const SizedBox(height: 16),

            // Course Title
            const Text(
              'Industrial DC Motor Installation',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),

            // Instructor and Description
            const Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.white24,
                  radius: 16,
                  child: Icon(Icons.person, color: Colors.white70),
                ),
                SizedBox(width: 10),
                Text('Ravi Kumar', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                SizedBox(width: 6),
                Text('• Lead Vocational Instructor', style: TextStyle(color: Colors.white60, fontSize: 12)),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'Gain practical knowledge of wiring and configuring standard AC/DC motors. This course covers ground configurations, voltage checks, coil routing, and troubleshooting single-phase systems.',
              style: TextStyle(color: Colors.white70, fontSize: 14, height: 1.5),
            ),
            const SizedBox(height: 24),

            // Enroll or Start Button
            CustomButton(
              text: _isEnrolled ? 'Resume Learning' : 'Enroll in Course',
              onPressed: () {
                if (_isEnrolled) {
                  context.push('/video/lesson-wiring-101');
                } else {
                  _handleEnrollment();
                }
              },
            ),
            const SizedBox(height: 32),

            // Syllabus Header
            Text(
              'Syllabus Content',
              style: theme.textTheme.titleLarge?.copyWith(fontSize: 18),
            ),
            const SizedBox(height: 12),

            // Syllabus Accordion Items
            ..._syllabus.map((sect) {
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                child: CustomCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        sect["section"] ?? "",
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.deepPurpleAccent),
                      ),
                      const SizedBox(height: 8),
                      const Divider(color: Colors.white10),
                      ...((sect["lessons"] as List).map((lesson) {
                        return ListTile(
                          title: Text(lesson["title"] ?? "", style: const TextStyle(fontSize: 13)),
                          subtitle: Text(lesson["duration"] ?? "", style: const TextStyle(fontSize: 11)),
                          trailing: const Icon(Icons.play_circle_fill_rounded, size: 24, color: Colors.white38),
                          contentPadding: EdgeInsets.zero,
                          onTap: () {
                            if (_isEnrolled) {
                              context.push('/video/${lesson["id"]}');
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Please enroll in the course to access lessons.')),
                              );
                            }
                          },
                        );
                      })),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
