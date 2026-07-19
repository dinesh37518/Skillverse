import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'video_analysis_provider.dart';
import '../../widgets/custom_card.dart';
import '../../widgets/custom_button.dart';

class VideoAnalysisScreen extends ConsumerStatefulWidget {
  const VideoAnalysisScreen({super.key});

  @override
  ConsumerState<VideoAnalysisScreen> createState() => _VideoAnalysisScreenState();
}

class _VideoAnalysisScreenState extends ConsumerState<VideoAnalysisScreen> with SingleTickerProviderStateMixin {
  final _urlController = TextEditingController();
  final _chatController = TextEditingController();
  TabController? _tabController;
  int _activeCardIndex = 0;
  bool _isFlipped = false;
  int _activeQuestionIndex = 0;
  bool _showChat = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _urlController.dispose();
    _chatController.dispose();
    _tabController?.dispose();
    super.dispose();
  }

  void _triggerAnalysis() {
    FocusScope.of(context).unfocus();
    final url = _urlController.text.trim();
    if (url.isEmpty) return;
    ref.read(videoAnalysisProvider.notifier).analyzeUrl(url);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final state = ref.watch(videoAnalysisProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Educational Video Analysis', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          if (state.analyzedVideo != null)
            IconButton(
              icon: const Icon(Icons.clear_all_rounded),
              onPressed: () {
                _urlController.clear();
                ref.read(videoAnalysisProvider.notifier).clearState();
              },
            )
        ],
      ),
      body: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // URL Paste Input Area
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _urlController,
                        style: const TextStyle(fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'Paste YouTube, Vimeo, or MP4 URL here...',
                          errorText: state.error,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          suffixIcon: _urlController.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear, size: 18),
                                  onPressed: () {
                                    setState(() {
                                      _urlController.clear();
                                    });
                                  },
                                )
                              : null,
                        ),
                        onChanged: (text) => setState(() {}),
                        onSubmitted: (_) => _triggerAnalysis(),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.primaryColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: _urlController.text.isEmpty ? null : _triggerAnalysis,
                      child: const Text('Analyze', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),

              if (state.isLoading)
                const Expanded(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(color: Colors.deepPurpleAccent),
                        SizedBox(height: 16),
                        Text("Analyzing educational content structures...", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white70)),
                        Text("Detecting languages and transcribing dialog tracks...", style: TextStyle(fontSize: 12, color: Colors.white38)),
                      ],
                    ),
                  ),
                )
              else if (state.analyzedVideo == null)
                Expanded(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.video_library_rounded, size: 64, color: theme.primaryColor.withOpacity(0.4)),
                          const SizedBox(height: 16),
                          const Text(
                            "Enter an educational video link above to generate transcriptions, study cards, practice test quizzes, and revision guides.",
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white54, height: 1.4),
                          ),
                          const SizedBox(height: 24),
                          const Text("Supported Formats:", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white38)),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _formatChip("YouTube"),
                              const SizedBox(width: 8),
                              _formatChip("Vimeo"),
                              const SizedBox(width: 8),
                              _formatChip("Direct MP4"),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                )
              else
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Video Header Metadata
                      _buildVideoHeader(state.analyzedVideo!),
                      
                      // Tabs Navigation
                      TabBar(
                        controller: _tabController,
                        indicatorColor: theme.primaryColor,
                        labelColor: Colors.white,
                        unselectedLabelColor: Colors.white54,
                        labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        tabs: const [
                          Tab(text: 'Overview'),
                          Tab(text: 'Study Notes'),
                          Tab(text: 'Flashcards'),
                          Tab(text: 'Practice Quiz'),
                        ],
                      ),

                      // Tabs Workspace
                      Expanded(
                        child: TabBarView(
                          controller: _tabController,
                          children: [
                            _buildOverviewTab(state.analyzedVideo!),
                            _buildNotesTab(state.analyzedVideo!),
                            _buildFlashcardsTab(state.analyzedVideo!),
                            _buildQuizTab(state.analyzedVideo!),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),

          // Collapsible Floating Chat Assistant Panel
          if (state.analyzedVideo != null)
            _buildChatOverlay(state),
        ],
      ),
    );
  }

  Widget _formatChip(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(8)),
      child: Text(text, style: const TextStyle(fontSize: 11, color: Colors.white60)),
    );
  }

  Widget _buildVideoHeader(Map<String, dynamic> video) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: const Color(0xFF0F172A),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(color: Colors.deepPurpleAccent, borderRadius: BorderRadius.circular(6)),
                child: Text(
                  video['estimated_difficulty'] ?? 'Intermediate',
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                "Duration: ${video['duration'] ?? '10:00'}",
                style: const TextStyle(fontSize: 11, color: Colors.white60),
              ),
              const SizedBox(width: 12),
              Text(
                "Language: ${video['spoken_language'] ?? 'English'}",
                style: const TextStyle(fontSize: 11, color: Colors.white60),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            video['title'] ?? 'Video Analysis Result',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
          ),
          const SizedBox(height: 4),
          Text(
            video['description'] ?? '',
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 12, color: Colors.white38),
          ),
        ],
      ),
    );
  }

  Widget _buildOverviewTab(Map<String, dynamic> video) {
    final objectives = video['learning_objectives'] as List<dynamic>;
    final concepts = video['key_concepts'] as List<dynamic>;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("AI Summary", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.cyanAccent)),
          const SizedBox(height: 8),
          CustomCard(
            color: const Color(0xFF1E293B),
            child: Text(
              video['summary'] ?? '',
              style: const TextStyle(height: 1.4),
            ),
          ),
          const SizedBox(height: 20),

          const Text("Learning Objectives", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.cyanAccent)),
          const SizedBox(height: 8),
          ...objectives.map((obj) => Padding(
                padding: const EdgeInsets.only(bottom: 6.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.check_circle_outline_rounded, color: Colors.greenAccent, size: 16),
                    const SizedBox(width: 8),
                    Expanded(child: Text(obj.toString(), style: const TextStyle(fontSize: 13, color: Colors.white70))),
                  ],
                ),
              )),
          const SizedBox(height: 20),

          const Text("Key Concepts Analyzed", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.cyanAccent)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: concepts.map((concept) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: Colors.deepPurpleAccent.withOpacity(0.1), border: Border.all(color: Colors.deepPurpleAccent.withOpacity(0.2)), borderRadius: BorderRadius.circular(20)),
                  child: Text(concept.toString(), style: const TextStyle(fontSize: 12, color: Colors.white70)),
                )).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildNotesTab(Map<String, dynamic> video) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Key Takeaways Revision", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.cyanAccent)),
          const SizedBox(height: 8),
          CustomCard(
            color: const Color(0xFF1E293B),
            child: Text(
              video['revision_notes'] ?? '',
              style: const TextStyle(height: 1.4, fontSize: 13),
            ),
          ),
          const SizedBox(height: 20),

          const Text("Lecture Notes", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.cyanAccent)),
          const SizedBox(height: 8),
          CustomCard(
            color: const Color(0xFF1E293B),
            child: Text(
              video['notes'] ?? '',
              style: const TextStyle(height: 1.4, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFlashcardsTab(Map<String, dynamic> video) {
    final flashcards = video['flashcards'] as List<dynamic>;
    if (flashcards.isEmpty) return const Center(child: Text("No study cards generated."));

    final currentCard = flashcards[_activeCardIndex];

    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "Card ${_activeCardIndex + 1} of ${flashcards.length}",
            style: const TextStyle(color: Colors.white38, fontSize: 12),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _isFlipped = !_isFlipped),
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: Card(
                  key: ValueKey<bool>(_isFlipped),
                  color: _isFlipped ? const Color(0xFF5B21B6) : const Color(0xFF1E293B),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: Colors.white12)),
                  child: Container(
                    alignment: Alignment.center,
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _isFlipped ? Icons.lightbulb_rounded : Icons.help_outline_rounded,
                          color: _isFlipped ? Colors.amberAccent : Colors.cyanAccent,
                          size: 32,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _isFlipped ? "ANSWER" : "TERM / QUESTION",
                          style: TextStyle(
                            fontSize: 10,
                            letterSpacing: 1.5,
                            fontWeight: FontWeight.bold,
                            color: _isFlipped ? Colors.amberAccent : Colors.cyanAccent,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _isFlipped ? currentCard['back'] : currentCard['front'],
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 16, height: 1.4, fontWeight: FontWeight.w500, color: Colors.white),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          "Tap to Flip",
                          style: TextStyle(fontSize: 10, color: Colors.white24),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back_ios_rounded),
                onPressed: _activeCardIndex > 0
                    ? () => setState(() {
                          _activeCardIndex--;
                          _isFlipped = false;
                        })
                    : null,
              ),
              const Text("Tap card to check answer", style: TextStyle(fontSize: 12, color: Colors.white54)),
              IconButton(
                icon: const Icon(Icons.arrow_forward_ios_rounded),
                onPressed: _activeCardIndex < flashcards.length - 1
                    ? () => setState(() {
                          _activeCardIndex++;
                          _isFlipped = false;
                        })
                    : null,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuizTab(Map<String, dynamic> video) {
    final quiz = video['quiz'] as List<dynamic>;
    if (quiz.isEmpty) return const Center(child: Text("No quizzes generated."));

    final currentQuestion = quiz[_activeQuestionIndex];
    final options = currentQuestion['options'] as List<dynamic>;

    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            "Question ${_activeQuestionIndex + 1} of ${quiz.length}",
            style: const TextStyle(color: Colors.white38, fontSize: 12),
          ),
          const SizedBox(height: 12),
          CustomCard(
            color: const Color(0xFF1E293B),
            child: Text(
              currentQuestion['question'],
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: options.length,
              itemBuilder: (context, idx) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F172A),
                      foregroundColor: Colors.white70,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: const BorderSide(color: Colors.white10)),
                      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                      alignment: Alignment.centerLeft,
                    ),
                    onPressed: () {
                      final correct = currentQuestion['correct_index'] == idx;
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        backgroundColor: correct ? Colors.green : Colors.red,
                        content: Text(correct ? "Correct Choice!" : "Incorrect choice. Review concepts!"),
                      ));
                    },
                    child: Text("${String.fromCharCode(65 + idx)}. ${options[idx]}"),
                  ),
                );
              },
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                icon: const Icon(Icons.arrow_back, size: 18),
                label: const Text("Previous"),
                onPressed: _activeQuestionIndex > 0
                    ? () => setState(() {
                          _activeQuestionIndex--;
                        })
                    : null,
              ),
              TextButton.icon(
                icon: const Icon(Icons.arrow_forward, size: 18),
                label: const Text("Next"),
                onPressed: _activeQuestionIndex < quiz.length - 1
                    ? () => setState(() {
                          _activeQuestionIndex++;
                        })
                    : null,
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildChatOverlay(VideoAnalysisState state) {
    final theme = Theme.of(context);

    if (!_showChat) {
      return Positioned(
        bottom: 20,
        right: 20,
        child: FloatingActionButton.extended(
          backgroundColor: theme.primaryColor,
          icon: const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white),
          label: const Text("Ask Video AI", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
          onPressed: () => setState(() => _showChat = true),
        ),
      );
    }

    return Positioned(
      bottom: 16,
      right: 16,
      left: 16,
      child: Card(
        elevation: 12,
        color: const Color(0xFF0F172A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: Colors.white12)),
        child: Container(
          height: 380,
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.psychology, color: Colors.cyanAccent),
                      SizedBox(width: 8),
                      Text("Ask Video Companion", style: TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20, color: Colors.white54),
                    onPressed: () => setState(() => _showChat = false),
                  )
                ],
              ),
              const Divider(color: Colors.white12),
              
              // Chat Messages Stream
              Expanded(
                child: ListView.builder(
                  itemCount: state.chatMessages.length,
                  itemBuilder: (context, idx) {
                    final msg = state.chatMessages[idx];
                    final isUser = msg['role'] == 'user';
                    return Align(
                      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: isUser ? theme.primaryColor : const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.7),
                        child: Text(
                          msg['content'] ?? '',
                          style: TextStyle(fontSize: 12, color: isUser ? Colors.white : Colors.white70),
                        ),
                      ),
                    );
                  },
                ),
              ),

              if (state.isChatLoading)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 4.0),
                  child: Row(
                    children: [
                      SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.cyanAccent)),
                      SizedBox(width: 8),
                      Text("Tutor is analyzing context...", style: TextStyle(fontSize: 10, color: Colors.cyanAccent)),
                    ],
                  ),
                ),

              // Chat Input Toolbar
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _chatController,
                      style: const TextStyle(fontSize: 12),
                      decoration: InputDecoration(
                        hintText: 'Ask doubt about transcript/notes...',
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onSubmitted: (_) => _sendChatMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.send_rounded, color: Colors.deepPurpleAccent),
                    onPressed: _sendChatMessage,
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  void _sendChatMessage() {
    final text = _chatController.text.trim();
    if (text.isEmpty) return;
    _chatController.clear();
    ref.read(videoAnalysisProvider.notifier).askQuestion(text);
  }
}
