import 'package:flutter/material.dart';
import '../../widgets/custom_card.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  final List<Map<String, String>> _notifications = const [
    {
      "title": "Live Lecture Alert",
      "body": "Hydraulic Control Valves Vetting Class starting in 5 minutes.",
      "time": "Just now",
      "type": "live"
    },
    {
      "title": "AI Quiz Recommendation",
      "body": "Based on your recent motor wiring checklist, try this 5-question circuit test.",
      "time": "2 hours ago",
      "type": "ai"
    },
    {
      "title": "Course Update Published",
      "body": "Instructor Ravi Kumar added Section 3: AC Motor Coil Alignment to your syllabus.",
      "time": "1 day ago",
      "type": "course"
    }
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications Inbox'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _notifications.isEmpty
          ? const Center(
              child: Text('No notifications received yet.', style: TextStyle(color: Colors.white38)),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _notifications.length,
              itemBuilder: (context, index) {
                final alert = _notifications[index];
                IconData icon = Icons.info_outline_rounded;
                Color color = theme.primaryColor;

                if (alert["type"] == "live") {
                  icon = Icons.video_camera_front_rounded;
                  color = Colors.redAccent;
                } else if (alert["type"] == "ai") {
                  icon = Icons.psychology_rounded;
                  color = Colors.amberAccent;
                }

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: CustomCard(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(icon, color: color, size: 20),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    alert["title"] ?? "",
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                  ),
                                  Text(
                                    alert["time"] ?? "",
                                    style: const TextStyle(color: Colors.white38, fontSize: 10),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                  alert["body"] ?? "",
                                  style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
