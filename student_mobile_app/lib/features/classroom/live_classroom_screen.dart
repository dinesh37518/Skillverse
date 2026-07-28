import 'package:flutter/material.dart';

class LiveClassroomScreen extends StatefulWidget {
  final String sessionId;

  const LiveClassroomScreen({super.key, required this.sessionId});

  @override
  State<LiveClassroomScreen> createState() => _LiveClassroomScreenState();
}

class _LiveClassroomScreenState extends State<LiveClassroomScreen> {
  String _selectedLanguage = "Hindi";
  final List<String> _languagesList = [
    "English", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam", "Manipuri", "Marathi", "Nepali", "Odia", "Punjabi", "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Urdu"
  ];
  
  final List<Map<String, String>> _chatMessages = [
    {"sender": "Instructor", "message": "Verify the ground cables before switching the breaker."},
    {"sender": "Amit", "message": "जी, मैंने केबल की जांच कर ली है। [Translated to: Yes, I checked the cables.]"},
  ];

  final _chatController = TextEditingController();

  void _postMessage() {
    if (_chatController.text.trim().isEmpty) return;
    setState(() {
      _chatMessages.add({
        "sender": "You",
        "message": _chatController.text.trim()
      });
    });
    _chatController.clear();
  }

  bool _enableSubtitles = true;
  bool _enableLowDataMode = false;
  bool _enableAiSummarizer = true;
  bool _isMicMuted = false;
  bool _isCameraOff = false;
  String _videoQuality = "720p HD";

  void _showSettingsDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: const Color(0xFF0F172A),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Row(
                children: [
                  Icon(Icons.settings_suggest_rounded, color: Color(0xFF6366F1)),
                  SizedBox(width: 8),
                  Text('Live Class Settings', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Subtitles Toggle
                    SwitchListTile(
                      activeColor: const Color(0xFF6366F1),
                      title: const Text('Live Subtitles', style: TextStyle(color: Colors.white, fontSize: 14)),
                      subtitle: const Text('Real-time translation HUD', style: TextStyle(color: Colors.white54, fontSize: 11)),
                      value: _enableSubtitles,
                      onChanged: (val) {
                        setDialogState(() => _enableSubtitles = val);
                        setState(() => _enableSubtitles = val);
                      },
                    ),
                    const Divider(color: Colors.white12),

                    // Low Data Mode Toggle
                    SwitchListTile(
                      activeColor: const Color(0xFF06B6D4),
                      title: const Text('Low Bandwidth Data Saver', style: TextStyle(color: Colors.white, fontSize: 14)),
                      subtitle: const Text('Optimize audio & media for 2G/3G connections', style: TextStyle(color: Colors.white54, fontSize: 11)),
                      value: _enableLowDataMode,
                      onChanged: (val) {
                        setDialogState(() => _enableLowDataMode = val);
                        setState(() => _enableLowDataMode = val);
                      },
                    ),
                    const Divider(color: Colors.white12),

                    // AI Summarizer Toggle
                    SwitchListTile(
                      activeColor: const Color(0xFFF59E0B),
                      title: const Text('Auto AI Note Summarizer', style: TextStyle(color: Colors.white, fontSize: 14)),
                      subtitle: const Text('Compile key points during lecture', style: TextStyle(color: Colors.white54, fontSize: 11)),
                      value: _enableAiSummarizer,
                      onChanged: (val) {
                        setDialogState(() => _enableAiSummarizer = val);
                        setState(() => _enableAiSummarizer = val);
                      },
                    ),
                    const Divider(color: Colors.white12),

                    // Video Quality Dropdown
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Video Stream Quality', style: TextStyle(color: Colors.white, fontSize: 14)),
                        DropdownButton<String>(
                          value: _videoQuality,
                          dropdownColor: const Color(0xFF1E293B),
                          style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 13, fontWeight: FontWeight.bold),
                          items: ["Auto HD", "1080p Full HD", "720p HD", "480p SD", "Audio Only"]
                              .map((q) => DropdownMenuItem(value: q, child: Text(q)))
                              .toList(),
                          onChanged: (val) {
                            if (val != null) {
                              setDialogState(() => _videoQuality = val);
                              setState(() => _videoQuality = val);
                            }
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Apply Settings', style: TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.bold)),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E1A),
      appBar: AppBar(
        title: const Text('Live Multilingual Class', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0A0E1A),
        elevation: 0,
        actions: [
          // Settings Modal Button
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Color(0xFF6366F1)),
            onPressed: _showSettingsDialog,
            tooltip: 'Live Class Settings',
          ),
          const SizedBox(width: 4),
          // Preferred language chooser dropdown
          DropdownButton<String>(
            value: _selectedLanguage,
            dropdownColor: const Color(0xFF1E293B),
            underline: Container(),
            icon: const Icon(Icons.translate, color: Color(0xFF38BDF8)),
            items: _languagesList.map((String lang) {
              return DropdownMenuItem<String>(
                value: lang,
                child: Text(lang, style: const TextStyle(fontSize: 14, color: Colors.white)),
              );
            }).toList(),
            onChanged: (val) {
              if (val != null) {
                setState(() => _selectedLanguage = val);
              }
            },
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: Column(
        children: [
          // 1. WebRTC video rendering area mock frame
          Container(
            height: 220,
            margin: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.deepPurpleAccent.withOpacity(0.5)),
            ),
            child: Stack(
              children: [
                const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.video_camera_front, color: Colors.white38, size: 48),
                      SizedBox(height: 8),
                      Text('Connecting WebRTC Media stream...', style: TextStyle(color: Colors.white38)),
                    ],
                  ),
                ),
                
                // Live subtitle HUD overlay at bottom of screen
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    color: Colors.black54,
                    child: Text(
                      '[$_selectedLanguage Subtitles]: ग्राउंड केबल सुरक्षित करें और फिर स्विच ऑन करें।',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Colors.amberAccent,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // 2. Tab Navigation inside Classroom
          Expanded(
            child: DefaultTabController(
              length: 2,
              child: Column(
                children: [
                  const TabBar(
                    indicatorColor: Colors.deepPurpleAccent,
                    tabs: [
                      Tab(text: "Live Chat (Auto-Translated)"),
                      Tab(text: "AI Lecture Summary"),
                    ],
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        // Live Translated Chat panel
                        Column(
                          children: [
                            Expanded(
                              child: ListView.builder(
                                padding: const EdgeInsets.all(12),
                                itemCount: _chatMessages.length,
                                itemBuilder: (context, index) {
                                  final msg = _chatMessages[index];
                                  return Padding(
                                    padding: const EdgeInsets.only(bottom: 8.0),
                                    child: RichText(
                                      text: TextSpan(
                                        style: const TextStyle(fontSize: 14, color: Colors.white),
                                        children: [
                                          TextSpan(
                                            text: "${msg['sender']}: ",
                                            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.deepPurpleAccent),
                                          ),
                                          TextSpan(text: msg['message']),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                            // Message bar input
                            Container(
                              padding: const EdgeInsets.all(8),
                              color: const Color(0xFF1E293B),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: TextField(
                                      controller: _chatController,
                                      decoration: InputDecoration(
                                        hintText: 'Type message in your language...',
                                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                      ),
                                    ),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.send, color: Colors.deepPurpleAccent),
                                    onPressed: _postMessage,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        
                        // AI Notes summaries panel
                        const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: SingleChildScrollView(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Key Concepts Discussed:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                SizedBox(height: 8),
                                Text('- Ground connection prevents line shock hazards.\n- Breaker ratings should match motor starter current.\n- Instant translations verified across 22 Indic dialects.'),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
