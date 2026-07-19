import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/custom_card.dart';

class LiveClassesScreen extends StatefulWidget {
  const LiveClassesScreen({super.key});

  @override
  State<LiveClassesScreen> createState() => _LiveClassesScreenState();
}

class _LiveClassesScreenState extends State<LiveClassesScreen> {
  final List<Map<String, dynamic>> _liveSessions = [
    {
      "id": "mock-active-101",
      "title": "Hydraulic Control Valves Vetting",
      "instructor": "Ravi Kumar",
      "status": "live",
      "scheduledTime": "Started 10 mins ago",
      "webrtcRoom": "room-valves-101"
    },
    {
      "id": "mock-upcoming-102",
      "title": "PLC Ladder Logic Program Building",
      "instructor": "Priya Sharma",
      "status": "scheduled",
      "scheduledTime": "Tomorrow, 10:00 AM",
      "webrtcRoom": "room-plc-fundamentals"
    },
    {
      "id": "mock-upcoming-103",
      "title": "Three-Phase Motor Troubleshooting",
      "instructor": "Ravi Kumar",
      "status": "scheduled",
      "scheduledTime": "July 9, 2:00 PM",
      "webrtcRoom": "room-ac-motors"
    }
  ];

  final Set<String> _reminders = {};

  void _toggleReminder(String sessionId) {
    setState(() {
      if (_reminders.contains(sessionId)) {
        _reminders.remove(sessionId);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Class reminder turned off.')),
        );
      } else {
        _reminders.add(sessionId);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Class reminder set successfully!')),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final liveNow = _liveSessions.where((s) => s["status"] == "live").toList();
    final upcoming = _liveSessions.where((s) => s["status"] == "scheduled").toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Class Sessions'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Active Live classes tab list
            if (liveNow.isNotEmpty) ...[
              const Text('Active Streams (Live Now)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              ...liveNow.map((session) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: CustomCard(
                    color: Colors.redAccent.withOpacity(0.05),
                    borderSide: BorderSide(color: Colors.redAccent.withOpacity(0.2)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              session["instructor"] ?? "",
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.redAccent,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                'LIVE',
                                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          session["title"] ?? "",
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          session["scheduledTime"] ?? "",
                          style: const TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () => context.push('/classroom/${session["id"]}'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.redAccent,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          child: const Text('Join Live Lecture', style: TextStyle(color: Colors.white)),
                        ),
                      ],
                    ),
                  ),
                );
              }),
              const SizedBox(height: 16),
            ],

            // Upcoming class catalogs
            const Text('Upcoming Schedules', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            if (upcoming.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 32.0),
                  child: Text('No upcoming lectures scheduled.', style: TextStyle(color: Colors.white38)),
                ),
              )
            else
              ...upcoming.map((session) {
                final hasReminder = _reminders.contains(session["id"]);
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: CustomCard(
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.04),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.calendar_today_rounded, color: Colors.deepPurpleAccent, size: 24),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                session["title"] ?? "",
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${session["instructor"]} • ${session["scheduledTime"]}',
                                style: const TextStyle(color: Colors.white54, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: Icon(
                            hasReminder ? Icons.notifications_active_rounded : Icons.notifications_none_rounded,
                            color: hasReminder ? Colors.deepPurpleAccent : Colors.white38,
                          ),
                          onPressed: () => _toggleReminder(session["id"]!),
                        ),
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
