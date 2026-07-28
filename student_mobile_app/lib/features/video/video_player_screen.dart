import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/custom_card.dart';

class VideoPlayerScreen extends StatefulWidget {
  final String videoId;

  const VideoPlayerScreen({super.key, required this.videoId});

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  double _playbackSpeed = 1.0;
  String _captionLanguage = 'Hindi';
  bool _showCaptions = true;
  bool _isPlaying = true;
  double _sliderValue = 0.3;

  final List<double> _speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
  final List<String> _languages = [
    'English', 'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati', 'Hindi', 'Kannada', 'Kashmiri', 'Konkani', 'Maithili', 'Malayalam', 'Manipuri', 'Marathi', 'Nepali', 'Odia', 'Punjabi', 'Sanskrit', 'Santali', 'Sindhi', 'Tamil', 'Telugu', 'Urdu'
  ];

  void _showSpeedDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Select Playback Speed', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          backgroundColor: const Color(0xFF0F172A),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: _speeds.map((s) {
              return RadioListTile<double>(
                title: Text('${s}x', style: const TextStyle(fontSize: 14)),
                value: s,
                groupValue: _playbackSpeed,
                onChanged: (val) {
                  if (val != null) {
                    setState(() => _playbackSpeed = val);
                    Navigator.pop(context);
                  }
                },
              );
            }).toList(),
          ),
        );
      },
    );
  }

  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Subtitle Language', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          backgroundColor: const Color(0xFF0F172A),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: _languages.map((l) {
              return RadioListTile<String>(
                title: Text(l, style: const TextStyle(fontSize: 14)),
                value: l,
                groupValue: _captionLanguage,
                onChanged: (val) {
                  if (val != null) {
                    setState(() => _captionLanguage = val);
                    Navigator.pop(context);
                  }
                },
              );
            }).toList(),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Lesson Player'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Interactive Video Frame
          Container(
            height: 220,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: theme.colorScheme.outline),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Inner video controls simulation
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      icon: Icon(
                        _isPlaying ? Icons.pause_circle_filled : Icons.play_circle_filled,
                        size: 64,
                        color: theme.primaryColor,
                      ),
                      onPressed: () => setState(() => _isPlaying = !_isPlaying),
                    ),
                    const SizedBox(height: 8),
                    const Text('Video Stream Placeholder', style: TextStyle(color: Colors.white24, fontSize: 12)),
                  ],
                ),

                // Live Captions overlay
                if (_showCaptions)
                  Positioned(
                    bottom: 40,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.black87,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '[$_captionLanguage]: तांबे की तार को टर्मिनल 2 से जोड़ें।',
                        style: const TextStyle(color: Colors.amberAccent, fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),

                // Bottom Timeline progress bar
                Positioned(
                  bottom: 0,
                  left: 10,
                  right: 10,
                  child: Row(
                    children: [
                      Text(
                        '04:12',
                        style: TextStyle(fontSize: 10, color: Colors.white70),
                      ),
                      Expanded(
                        child: Slider(
                          value: _sliderValue,
                          onChanged: (v) => setState(() => _sliderValue = v),
                          activeColor: theme.primaryColor,
                          inactiveColor: Colors.white24,
                        ),
                      ),
                      Text(
                        '12:30',
                        style: TextStyle(fontSize: 10, color: Colors.white70),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 2. Playback control actions row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(_showCaptions ? Icons.subtitles_rounded : Icons.subtitles_off_rounded, color: theme.primaryColor),
                  onPressed: () => setState(() => _showCaptions = !_showCaptions),
                ),
                IconButton(
                  icon: const Icon(Icons.speed_rounded),
                  onPressed: _showSpeedDialog,
                  tooltip: 'Playback Speed',
                ),
                IconButton(
                  icon: const Icon(Icons.translate_rounded),
                  onPressed: _showLanguageDialog,
                  tooltip: 'Change Language',
                ),
                IconButton(
                  icon: const Icon(Icons.bookmark_border_rounded),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Timestamp bookmarked!')),
                    );
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.fullscreen_rounded),
                  onPressed: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // 3. Tab sections: Notes / PDF list
          Expanded(
            child: DefaultTabController(
              length: 2,
              child: Column(
                children: [
                  const TabBar(
                    indicatorColor: Colors.deepPurpleAccent,
                    labelColor: Colors.white,
                    unselectedLabelColor: Colors.white54,
                    tabs: [
                      Tab(text: 'Lesson Study Notes'),
                      Tab(text: 'Ask AI Tutor'),
                    ],
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        // Notes tab content
                        Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: SingleChildScrollView(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('AI Summary Note', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                    IconButton(
                                      icon: const Icon(Icons.download_rounded, size: 20, color: Colors.deepPurpleAccent),
                                      onPressed: () {},
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'This lesson covers the primary wiring processes for AC induction coils. Ensure safety checks on ground tolerances and utilize single-phase measurements appropriately.',
                                  style: TextStyle(color: Colors.white70, fontSize: 14, height: 1.5),
                                ),
                              ],
                            ),
                          ),
                        ),

                        // Quick Ask AI question trigger redirecting to Tutor tab
                        Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.psychology_rounded, size: 48, color: theme.primaryColor),
                              const SizedBox(height: 12),
                              const Text(
                                'Have a doubt about this lesson step?',
                                textAlign: TextAlign.center,
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Ask the AI Tutor to clarify DC terminal grounding rules instantly.',
                                textAlign: TextAlign.center,
                                style: TextStyle(color: Colors.white54, fontSize: 13),
                              ),
                              const SizedBox(height: 20),
                              ElevatedButton(
                                onPressed: () => context.go('/tutor'),
                                style: ElevatedButton.styleFrom(backgroundColor: theme.primaryColor),
                                child: const Text('Open AI Tutor Dialogue', style: TextStyle(color: Colors.white)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
