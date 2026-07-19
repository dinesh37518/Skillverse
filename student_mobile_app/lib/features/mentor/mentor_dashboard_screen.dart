import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'mentor_provider.dart';
import '../../widgets/custom_card.dart';
import '../../widgets/custom_button.dart';

class MentorDashboardScreen extends ConsumerStatefulWidget {
  const MentorDashboardScreen({super.key});

  @override
  ConsumerState<MentorDashboardScreen> createState() => _MentorDashboardScreenState();
}

class _MentorDashboardScreenState extends ConsumerState<MentorDashboardScreen> {
  @override
  void initState() {
    super.initState();
    // Fetch fresh dashboard data on start
    Future.microtask(() => ref.read(mentorProvider.notifier).fetchDashboard());
  }

  // Maps icon names to Flutter IconData
  IconData _getIconData(String iconName) {
    switch (iconName) {
      case 'school':
        return Icons.school_rounded;
      case 'local_fire_department':
        return Icons.local_fire_department_rounded;
      case 'workspace_premium':
        return Icons.workspace_premium_rounded;
      case 'psychology':
        return Icons.psychology_rounded;
      case 'speed':
        return Icons.speed_rounded;
      default:
        return Icons.auto_awesome_rounded;
    }
  }

  void _showEditGoalsDialog(Map<String, dynamic> todayGoal, Map<String, dynamic> weeklyGoal) {
    final todayController = TextEditingController(text: todayGoal['text']);
    final weeklyController = TextEditingController(text: weeklyGoal['text']);

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Update Learning Goals'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: todayController,
                decoration: const InputDecoration(
                  labelText: "Today's Learning Goal",
                  hintText: "e.g., Solve 1 circuit challenge",
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: weeklyController,
                decoration: const InputDecoration(
                  labelText: "Weekly Learning Goal",
                  hintText: "e.g., Complete 3 wiring labs",
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                final notifier = ref.read(mentorProvider.notifier);
                await notifier.updateGoals(
                  todayGoal: todayController.text,
                  weeklyGoal: weeklyController.text,
                );
                if (mounted) Navigator.pop(context);
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }

  void _showAssignmentBottomSheet(String title, String topicName) {
    ref.read(mentorProvider.notifier).generatePersonalizedAssignment("lesson-weak", topicName);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Consumer(
          builder: (context, ref, child) {
            final state = ref.watch(mentorProvider);
            
            if (state.isLoading && state.generatedAssignment == null) {
              return const SizedBox(
                height: 350,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircularProgressIndicator(color: Colors.deepPurpleAccent),
                      SizedBox(height: 16),
                      Text("AI Mentor is analyzing your weak area...", style: TextStyle(color: Colors.white70)),
                      Text("Synthesizing custom troubleshooting questions...", style: TextStyle(color: Colors.white54, fontSize: 12)),
                    ],
                  ),
                ),
              );
            }

            final assignment = state.generatedAssignment;
            if (assignment == null) {
              return const SizedBox(
                height: 200,
                child: Center(child: Text("Could not generate assignment. Please try again.")),
              );
            }

            final questions = assignment['questions'] as List<dynamic>;

            return DraggableScrollableSheet(
              initialChildSize: 0.75,
              maxChildSize: 0.95,
              minChildSize: 0.5,
              expand: false,
              builder: (context, scrollController) {
                return SingleChildScrollView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 5,
                          decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        children: [
                          const Icon(Icons.auto_awesome, color: Colors.cyanAccent),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              assignment['title'] ?? 'AI Practice Assignment',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        assignment['description'] ?? 'Targeted practice for core concepts.',
                        style: const TextStyle(color: Colors.white60, fontSize: 13),
                      ),
                      const Divider(height: 32, color: Colors.white12),
                      
                      ...List.generate(questions.length, (qIdx) {
                        final q = questions[qIdx];
                        final options = q['options'] as List<dynamic>;
                        return Card(
                          color: const Color(0xFF1E293B),
                          margin: const EdgeInsets.only(bottom: 20),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "Question ${qIdx + 1}: ${q['question']}",
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                                ),
                                const SizedBox(height: 12),
                                ...List.generate(options.length, (optIdx) {
                                  return Container(
                                    margin: const EdgeInsets.only(bottom: 8),
                                    child: ElevatedButton(
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: const Color(0xFF0F172A),
                                        foregroundColor: Colors.white70,
                                        alignment: Alignment.centerLeft,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                      ),
                                      onPressed: () {
                                        final correct = q['correct_index'] == optIdx;
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(
                                            backgroundColor: correct ? Colors.green : Colors.red,
                                            content: Text(correct ? "Correct! ${q['explanation']}" : "Incorrect. Try again!"),
                                          ),
                                        );
                                      },
                                      child: Text("${String.fromCharCode(65 + optIdx)}. ${options[optIdx]}"),
                                    ),
                                  );
                                }),
                              ],
                            ),
                          ),
                        );
                      }),
                      CustomButton(
                        text: "Finish Assignment",
                        onPressed: () {
                          ref.read(mentorProvider.notifier).clearAssignment();
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              backgroundColor: Colors.deepPurpleAccent,
                              content: Text("Assignment completed! Mentor dashboard updating."),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                );
              },
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final state = ref.watch(mentorProvider);

    if (state.isLoading && state.dashboardData == null) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: Colors.deepPurpleAccent),
        ),
      );
    }

    final data = state.dashboardData;
    if (data == null) {
      return const Scaffold(
        body: Center(
          child: Text("Error gathering mentor diagnostics."),
        ),
      );
    }

    final todayGoal = data['today_goal'] as Map<String, dynamic>;
    final weeklyGoal = data['weekly_goal'] as Map<String, dynamic>;
    final progress = data['learning_progress'] as double;
    final streak = data['learning_streak'] as int;
    final skillGrowth = data['skill_growth'] as List<dynamic>;
    final recommendedLessons = data['recommended_lessons'] as List<dynamic>;
    final recommendedRevisions = data['recommended_revisions'] as List<dynamic>;
    final suggestions = data['ai_suggestions'] as Map<String, dynamic>;
    final upcomingLive = data['upcoming_live_sessions'] as List<dynamic>;
    final recentlyWeak = data['recently_weak_topics'] as List<dynamic>;
    final recentlyImproved = data['recently_improved_topics'] as List<dynamic>;
    final badges = data['badges'] as List<dynamic>;

    // Grab first message
    final motivationalMessages = data['motivational_messages'] as List<dynamic>;
    final motMessage = motivationalMessages.isNotEmpty ? motivationalMessages[0].toString() : "Success is built brick by brick. Keep learning!";

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Personal Mentor', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => ref.read(mentorProvider.notifier).fetchDashboard(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // AI Motivational Insight Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.deepPurpleAccent.withOpacity(0.2), Colors.cyanAccent.withOpacity(0.05)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.deepPurpleAccent.withOpacity(0.25)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.psychology, color: Colors.cyanAccent, size: 36),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("MENTOR INSIGHT", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.cyanAccent, letterSpacing: 1.2)),
                        const SizedBox(height: 4),
                        Text(
                          motMessage,
                          style: const TextStyle(fontSize: 13, height: 1.4, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Streak & Progress Section
            Row(
              children: [
                Expanded(
                  child: CustomCard(
                    color: const Color(0xFF1E293B),
                    child: Column(
                      children: [
                        const Text("Streak", style: TextStyle(color: Colors.white54, fontSize: 13)),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.local_fire_department, color: Colors.orangeAccent, size: 28),
                            const SizedBox(width: 4),
                            Text(
                              "$streak Days",
                              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        const Text("Streak active!", style: TextStyle(color: Colors.greenAccent, fontSize: 10)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: CustomCard(
                    color: const Color(0xFF1E293B),
                    child: Column(
                      children: [
                        const Text("Course Progress", style: TextStyle(color: Colors.white54, fontSize: 13)),
                        const SizedBox(height: 8),
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            SizedBox(
                              width: 48,
                              height: 48,
                              child: CircularProgressIndicator(
                                value: progress / 100,
                                strokeWidth: 5,
                                backgroundColor: Colors.white10,
                                valueColor: const AlwaysStoppedAnimation(Colors.deepPurpleAccent),
                              ),
                            ),
                            Text("${progress.toStringAsFixed(0)}%", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Goals Card
            CustomCard(
              color: const Color(0xFF0F172A),
              borderSide: BorderSide(color: Colors.deepPurpleAccent.withOpacity(0.2)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.track_changes, color: Colors.deepPurpleAccent),
                          SizedBox(width: 8),
                          Text("Personal Goals", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.edit_calendar_rounded, size: 20, color: Colors.white60),
                        onPressed: () => _showEditGoalsDialog(todayGoal, weeklyGoal),
                      ),
                    ],
                  ),
                  const Divider(color: Colors.white12, height: 16),
                  
                  // Today's Goal
                  _buildGoalRow("Today", todayGoal['text'], todayGoal['progress'], todayGoal['completed']),
                  const SizedBox(height: 16),
                  
                  // Weekly Goal
                  _buildGoalRow("Weekly", weeklyGoal['text'], weeklyGoal['progress'], weeklyGoal['completed']),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Badges Section
            if (badges.isNotEmpty) ...[
              const Text("Badges Unlocked", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              SizedBox(
                height: 100,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: badges.length,
                  itemBuilder: (context, index) {
                    final badge = badges[index];
                    return Container(
                      width: 100,
                      margin: const EdgeInsets.only(right: 12),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.amber.withOpacity(0.15)),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(_getIconData(badge['icon']), color: Colors.amberAccent, size: 30),
                          const SizedBox(height: 6),
                          Text(
                            badge['name'],
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            badge['date_earned'] ?? "",
                            style: const TextStyle(fontSize: 8, color: Colors.white30),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Skill Growth Section
            const Text("Skill Growth", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            CustomCard(
              color: const Color(0xFF1E293B),
              child: Column(
                children: skillGrowth.map((skill) {
                  final String name = skill['skill'];
                  final int lvl = skill['level'];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12.0),
                    child: Row(
                      children: [
                        SizedBox(width: 80, child: Text(name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500))),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: lvl / 100.0,
                              minHeight: 8,
                              backgroundColor: Colors.white10,
                              valueColor: const AlwaysStoppedAnimation(Colors.deepPurpleAccent),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text("$lvl%", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70)),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 24),

            // Recommended Lessons
            if (recommendedLessons.isNotEmpty) ...[
              const Text("Next Recommendation", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              ...recommendedLessons.map((l) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(12),
                    leading: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(color: Colors.deepPurpleAccent.withOpacity(0.15), borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.play_circle_fill_rounded, color: Colors.deepPurpleAccent),
                    ),
                    title: Text(l['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text("${l['course_title']} • Next up"),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                    onTap: () => context.push('/video/${l['id']}'),
                  ),
                );
              }),
              const SizedBox(height: 16),
            ],

            // Recommended Revisions
            if (recommendedRevisions.isNotEmpty) ...[
              const Text("Revision Schedule", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              ...recommendedRevisions.map((l) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(12),
                    leading: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(color: Colors.amber.withOpacity(0.15), borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.history_edu_rounded, color: Colors.amber),
                    ),
                    title: Text(l['title']),
                    subtitle: Text(l['reason']),
                    trailing: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.amber, foregroundColor: Colors.black, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                      onPressed: () => _showAssignmentBottomSheet("Personalized Quiz", l['title']),
                      child: const Text("Study", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ),
                );
              }),
              const SizedBox(height: 16),
            ],

            // AI Dashboard Suggestions Details
            const Text("AI Mentor Guidance", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            CustomCard(
              color: const Color(0xFF1E293B),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Predicted Weak Areas", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.redAccent)),
                  const SizedBox(height: 6),
                  ...(suggestions['predicted_weak_areas'] as List<dynamic>).map((wa) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 6.0),
                      child: Row(
                        children: [
                          const Icon(Icons.warning_amber_rounded, color: Colors.redAccent, size: 16),
                          const SizedBox(width: 8),
                          Expanded(child: Text(wa.toString(), style: const TextStyle(fontSize: 12, color: Colors.white70))),
                        ],
                      ),
                    );
                  }),
                  const SizedBox(height: 16),
                  const Text("Learning Difficulties Warning", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.orangeAccent)),
                  const SizedBox(height: 6),
                  ...(suggestions['predicted_learning_difficulties'] as List<dynamic>).map((ld) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 6.0),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline_rounded, color: Colors.orangeAccent, size: 16),
                          const SizedBox(width: 8),
                          Expanded(child: Text(ld.toString(), style: const TextStyle(fontSize: 12, color: Colors.white70))),
                        ],
                      ),
                    );
                  }),
                  const SizedBox(height: 16),
                  const Text("Suggested Career Pathways", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.greenAccent)),
                  const SizedBox(height: 6),
                  ...(suggestions['career_pathways'] as List<dynamic>).map((cp) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 6.0),
                      child: Row(
                        children: [
                          const Icon(Icons.explore_outlined, color: Colors.greenAccent, size: 16),
                          const SizedBox(width: 8),
                          Expanded(child: Text(cp.toString(), style: const TextStyle(fontSize: 12, color: Colors.white70))),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Recently Weak vs Improved Topics
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Topics to Improve", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.redAccent)),
                      const SizedBox(height: 8),
                      ...recentlyWeak.map((item) {
                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: Colors.redAccent.withOpacity(0.05), borderRadius: BorderRadius.circular(10)),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item['topic'], style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                              const SizedBox(height: 4),
                              Text("Score: ${item['score']}%", style: const TextStyle(fontSize: 10, color: Colors.redAccent)),
                            ],
                          ),
                        );
                      }),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Topic Strengths", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.greenAccent)),
                      const SizedBox(height: 8),
                      ...recentlyImproved.map((item) {
                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: Colors.greenAccent.withOpacity(0.05), borderRadius: BorderRadius.circular(10)),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item['topic'], style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                              const SizedBox(height: 4),
                              Text("Score: ${item['score']}%", style: const TextStyle(fontSize: 10, color: Colors.greenAccent)),
                            ],
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Upcoming Live Sessions
            if (upcomingLive.isNotEmpty) ...[
              const Text("Upcoming Live Sessions", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              ...upcomingLive.map((s) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: const Icon(Icons.video_call_rounded, color: Colors.redAccent, size: 28),
                    title: Text(s['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text("${s['course_title']} \nStarts in 4 hours"),
                    trailing: const Icon(Icons.chevron_right_rounded),
                    onTap: () => context.push('/classroom/${s['id']}'),
                  ),
                );
              }),
              const SizedBox(height: 16),
            ],

            // Additional Learning Resources
            const Text("Additional Study Materials", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            ...((suggestions['additional_resources'] ?? []) as List<dynamic>).map((res) {
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: Icon(res['type'] == 'video' ? Icons.ondemand_video_rounded : Icons.article_rounded, color: Colors.cyanAccent),
                  title: Text(res['title']),
                  subtitle: const Text("Recommended Link"),
                  trailing: const Icon(Icons.open_in_new_rounded, size: 16),
                  onTap: () {},
                ),
              );
            }),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalRow(String period, String goalText, double progress, bool completed) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "$period's Goal",
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white70),
            ),
            Text(
              completed ? "Completed" : "${(progress * 100).toStringAsFixed(0)}%",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: completed ? Colors.greenAccent : Colors.amberAccent),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          goalText,
          style: const TextStyle(fontSize: 12, color: Colors.white54),
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 5,
            backgroundColor: Colors.white10,
            valueColor: AlwaysStoppedAnimation(completed ? Colors.greenAccent : Colors.deepPurpleAccent),
          ),
        ),
      ],
    );
  }
}
