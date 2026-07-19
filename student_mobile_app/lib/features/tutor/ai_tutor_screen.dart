import 'package:flutter/material.dart';
import '../../widgets/custom_card.dart';

class AITutorScreen extends StatefulWidget {
  const AITutorScreen({super.key});

  @override
  State<AITutorScreen> createState() => _AITutorScreenState();
}

class _AITutorScreenState extends State<AITutorScreen> {
  final List<Map<String, String>> _messages = [
    {
      "role": "assistant",
      "content": "Namaste! I am your SkillVerse AI learning companion. Ask me any vocational concept doubt in your preferred language, or upload a handbook to start learning."
    }
  ];

  final _chatController = TextEditingController();
  bool _isTyping = false;

  final List<String> _quickPrompts = [
    "Explain AC Motor Phase Wiring",
    "Generate a quiz on Voltage Safety",
    "List DC circuit definitions",
  ];

  void _postMessage(String text) {
    if (text.trim().isEmpty) return;
    
    setState(() {
      _messages.add({"role": "user", "content": text});
      _isTyping = true;
    });

    _chatController.clear();

    // Emulate AI responses
    Future.delayed(const Duration(seconds: 1500), () {
      if (!mounted) return;
      setState(() {
        _messages.add({
          "role": "assistant",
          "content": "For multi-phase configurations, check coil terminations 1, 2, and 3. Ensure continuity tests pass before loading. Let me know if you would like me to generate cards to study this."
        });
        _isTyping = false;
      });
    });
  }

  void _uploadAttachment() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Select PDF/PPT lesson document to upload (Mocked)')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Learning Companion'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.attach_file_rounded),
            onPressed: _uploadAttachment,
          )
        ],
      ),
      body: Column(
        children: [
          // Quick Prompts list at top
          if (_messages.length == 1)
            Padding(
              padding: const EdgeInsets.only(top: 12.0),
              child: SizedBox(
                height: 38,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _quickPrompts.length,
                  itemBuilder: (context, index) {
                    return Container(
                      margin: const EdgeInsets.only(right: 8),
                      child: ActionChip(
                        label: Text(_quickPrompts[index], style: const TextStyle(fontSize: 12)),
                        onPressed: () => _postMessage(_quickPrompts[index]),
                        backgroundColor: theme.cardColor,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    );
                  },
                ),
              ),
            ),

          // Message log stream list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final m = _messages[index];
                final isUser = m["role"] == "user";

                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isUser ? theme.primaryColor : theme.cardColor,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: isUser ? const Radius.circular(16) : Radius.zero,
                        bottomRight: isUser ? Radius.zero : const Radius.circular(16),
                      ),
                      border: isUser ? null : Border.all(color: theme.colorScheme.outline),
                    ),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
                    child: Text(
                      m["content"] ?? "",
                      style: TextStyle(
                        fontSize: 14,
                        color: isUser ? Colors.white : theme.textTheme.bodyMedium?.color,
                        height: 1.4,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Typing Loader bubble
          if (_isTyping)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Row(
                  children: [
                    const SizedBox(
                      width: 14,
                      height: 14,
                      child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(Colors.deepPurpleAccent)),
                    ),
                    const SizedBox(width: 8),
                    Text('Tutor is composing answer...', style: TextStyle(fontSize: 12, color: theme.primaryColor)),
                  ],
                ),
              ),
            ),

          // Input Toolbar at bottom
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.scaffoldBackgroundColor,
              border: Border(top: BorderSide(color: theme.colorScheme.outline)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _chatController,
                    onSubmitted: _postMessage,
                    style: const TextStyle(fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Enter question or doubt details...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.mic_none_rounded, color: Colors.deepPurpleAccent),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.send_rounded, color: Colors.deepPurpleAccent),
                  onPressed: () => _postMessage(_chatController.text),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
