import 'package:flutter/material.dart';
import '../../widgets/custom_card.dart';

class NotesScreen extends StatefulWidget {
  const NotesScreen({super.key});

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  final _searchController = TextEditingController();
  bool _filterAIOnly = false;
  String _searchQuery = '';

  final List<Map<String, dynamic>> _notes = [
    {
      "id": "note-101",
      "title": "AC Induction Motor Principles",
      "lesson": "AC Induction Systems",
      "isAi": true,
      "summary": "Key details covering phase wiring tolerances, coils winding indexes, and grounding safety checks.",
    },
    {
      "id": "note-102",
      "title": "Valve Controls Safety Limits",
      "lesson": "Hydraulic Valves Installation",
      "isAi": false,
      "summary": "Personal lecture logs capturing safety pressure relief bounds and mechanical layouts.",
    },
    {
      "id": "note-103",
      "title": "PLC Registers Reference Table",
      "lesson": "PLC Programming Fundamentals",
      "isAi": true,
      "summary": "AI generated code guide mapping binary address maps, timers, and counter structures.",
    }
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _downloadNote(String title) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Downloading "$title" handout offline...')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    final filteredNotes = _notes.where((n) {
      final matchesSearch = n["title"]!.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          n["lesson"]!.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesFilter = !_filterAIOnly || n["isAi"] == true;
      return matchesSearch && matchesFilter;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Study Handouts & Notes'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Column(
          children: [
            // Search field
            TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: const InputDecoration(
                hintText: 'Search study handouts...',
                prefixIcon: Icon(Icons.search_rounded),
              ),
            ),
            const SizedBox(height: 12),

            // Toggle filter row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Show AI summaries only',
                  style: TextStyle(fontSize: 14, color: Colors.white70),
                ),
                Switch(
                  value: _filterAIOnly,
                  onChanged: (val) => setState(() => _filterAIOnly = val),
                  activeColor: theme.primaryColor,
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Results List
            Expanded(
              child: filteredNotes.isEmpty
                  ? const Center(
                      child: Text('No notes matches found.', style: TextStyle(color: Colors.white38)),
                    )
                  : ListView.builder(
                      itemCount: filteredNotes.length,
                      itemBuilder: (context, index) {
                        final note = filteredNotes[index];
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: CustomCard(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        note["title"] ?? "",
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                      ),
                                    ),
                                    if (note["isAi"] == true)
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: theme.primaryColor.withOpacity(0.15),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          'AI GENERATED',
                                          style: TextStyle(color: theme.primaryColor, fontSize: 9, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  note["lesson"] ?? "",
                                  style: const TextStyle(color: Colors.white38, fontSize: 11),
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  note["summary"] ?? "",
                                  style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                                ),
                                const SizedBox(height: 12),
                                const Divider(color: Colors.white10),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.bookmark_border_rounded, size: 20, color: Colors.white60),
                                      onPressed: () {},
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.download_rounded, size: 20, color: Colors.deepPurpleAccent),
                                      onPressed: () => _downloadNote(note["title"]!),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
