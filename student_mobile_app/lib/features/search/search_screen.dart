import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/custom_card.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  String _selectedFilter = 'All';
  bool _showResults = false;

  final List<String> _filters = [
    'All', 'Courses', 'Videos', 'PDFs', 'Quizzes', 'Notes', 'Flashcards'
  ];

  final List<Map<String, String>> _suggestions = [
    {"term": "DC Motor Grounding Checks", "category": "Electrical"},
    {"term": "Safety Valves Pressure Specs", "category": "Plumbing"},
    {"term": "Industrial Blueprint Symbols", "category": "General"},
  ];

  final List<Map<String, dynamic>> _searchResults = [
    {
      "id": "1",
      "type": "Course",
      "title": "Industrial DC Motor Installation",
      "subtitle": "Electrical • 6 lessons",
      "icon": Icons.school_rounded,
    },
    {
      "id": "2",
      "type": "Video",
      "title": "Grounding Safety & Hazard Diagnostics",
      "subtitle": "Safety • Video lesson (12 mins)",
      "icon": Icons.play_circle_fill_rounded,
    },
    {
      "id": "3",
      "type": "PDF",
      "title": "Valve Routing Specifications Handbook",
      "subtitle": "Plumbing • Study guide manual",
      "icon": Icons.file_present_rounded,
    },
    {
      "id": "4",
      "type": "Quiz",
      "title": "DC Circuits Self-Check Test",
      "subtitle": "Interactive Checkpoint Quiz",
      "icon": Icons.quiz_rounded,
    }
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _triggerSearch(String term) {
    if (term.trim().isEmpty) return;
    setState(() {
      _searchController.text = term;
      _showResults = true;
    });
  }

  void _triggerVoiceSearch() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Voice Search Triggered (Mocked Client)')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Search Input Toolbar
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      onSubmitted: _triggerSearch,
                      decoration: InputDecoration(
                        hintText: 'Search motor wiring, valve specs...',
                        prefixIcon: const Icon(Icons.search_rounded),
                        suffixIcon: _searchController.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear_rounded),
                                onPressed: () {
                                  _searchController.clear();
                                  setState(() => _showResults = false);
                                },
                              )
                            : null,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  IconButton(
                    icon: const Icon(Icons.mic_none_rounded, color: Colors.deepPurpleAccent),
                    onPressed: _triggerVoiceSearch,
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Horizontal scrollable Filters
              SizedBox(
                height: 38,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _filters.length,
                  itemBuilder: (context, index) {
                    final isSelected = _selectedFilter == _filters[index];
                    return Container(
                      margin: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(_filters[index]),
                        selected: isSelected,
                        onSelected: (val) {
                          if (val) {
                            setState(() => _selectedFilter = _filters[index]);
                          }
                        },
                        selectedColor: theme.primaryColor.withOpacity(0.15),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),

              // Search Body Context
              Expanded(
                child: _showResults ? _buildResultsList() : _buildSuggestionsView(theme),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSuggestionsView(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Suggested Search Topics', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 12),
        ..._suggestions.map(
          (s) => ListTile(
            leading: const Icon(Icons.trending_up_rounded, size: 20, color: Colors.white54),
            title: Text(s["term"] ?? ""),
            subtitle: Text(s["category"] ?? "", style: const TextStyle(color: Colors.white38, fontSize: 11)),
            contentPadding: EdgeInsets.zero,
            trailing: const Icon(Icons.north_west_rounded, size: 16, color: Colors.white38),
            onTap: () => _triggerSearch(s["term"] ?? ""),
          ),
        ),
      ],
    );
  }

  Widget _buildResultsList() {
    final filteredResults = _selectedFilter == 'All'
        ? _searchResults
        : _searchResults.where((r) => r['type'] == _selectedFilter.substring(0, _selectedFilter.length - 1)).toList();

    if (filteredResults.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off_rounded, size: 48, color: Colors.white38),
            SizedBox(height: 12),
            Text('No results match your query.', style: TextStyle(color: Colors.white38)),
          ],
        ),
      );
    }

    return ListView.builder(
      itemCount: filteredResults.length,
      itemBuilder: (context, index) {
        final item = filteredResults[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          child: CustomCard(
            onTap: () {
              final type = item['type'];
              final id = item['id'];
              if (type == 'Course') {
                context.push('/course/$id');
              } else if (type == 'Video') {
                context.push('/video/$id');
              } else if (type == 'Quiz') {
                context.push('/quiz/$id');
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Opening ${item['title']}...')),
                );
              }
            },
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.04),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(item['icon'], color: Colors.deepPurpleAccent, size: 24),
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
                            item['title'],
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          Text(
                            item['type'],
                            style: const TextStyle(color: Colors.deepPurpleAccent, fontWeight: FontWeight.bold, fontSize: 10),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(item['subtitle'], style: const TextStyle(color: Colors.white54, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
