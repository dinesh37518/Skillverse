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
    "English", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada"
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Multilingual Class'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          // Preferred language chooser dropdown
          DropdownButton<String>(
            value: _selectedLanguage,
            dropdownColor: const Color(0xFF1E293B),
            underline: Container(),
            icon: const Icon(Icons.translate, color: Colors.deepPurpleAccent),
            items: _languagesList.map((String lang) {
              return DropdownMenuItem<String>(
                value: lang,
                child: Text(lang, style: const TextStyle(fontSize: 14)),
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
