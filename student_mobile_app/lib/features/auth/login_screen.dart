import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_input.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();

  // Form controllers
  final _nameController = TextEditingController();
  final _stateController = TextEditingController();
  final _districtController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _schoolNameController = TextEditingController();
  final _schoolAddressController = TextEditingController();

  String? _selectedStandard;
  String? _selectedInterest;

  bool _showOTP = false;
  bool _isLoading = false;
  String _generatedOTP = '';
  final _otpController = TextEditingController();

  final List<String> _standards = const [
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12',
  ];

  final List<String> _interests = const [
    'Physics & Mechanics',
    'Chemistry & Molecular Science',
    'Biology & Life Sciences',
    'Science Experiments & Lab Research',
    'History & Ancient Civilizations',
    'Geography & Earth Studies',
    'Civics, Government & Politics',
    'Economics & Financial Basics',
    'English Language & Literature',
    'Regional Languages & Linguistics',
    'Mathematics & Geometry Puzzles',
    'Computer Science & Programming',
    'Environmental Science & Ecology',
    'Art, Painting & Creative Design',
    'Sports, Fitness & Nutrition Science',
    'General Knowledge & Trivia',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _stateController.dispose();
    _districtController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _schoolNameController.dispose();
    _schoolAddressController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _requestOTP() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedStandard == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select your standard of studying.')),
      );
      return;
    }
    if (_selectedInterest == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select your topic of interest.')),
      );
      return;
    }

    setState(() => _isLoading = true);

    final email = _emailController.text.trim();
    final random = Random();
    final otp = (100000 + random.nextInt(900000)).toString();

    // Call authProvider to trigger email OTP request
    await ref.read(authProvider.notifier).requestEmailOTP(email);

    if (mounted) {
      setState(() {
        _generatedOTP = otp;
        _showOTP = true;
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          duration: const Duration(seconds: 15),
          backgroundColor: Colors.deepPurpleAccent,
          content: Text(
            '🔑 [EMAIL VERIFICATION CODE] Code: $otp — sent to $email',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
        ),
      );
    }
  }

  void _verifyOTP() async {
    final entered = _otpController.text.trim();
    if (entered.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter a valid 6-digit verification code.')),
      );
      return;
    }

    final details = {
      'name': _nameController.text.trim(),
      'email': _emailController.text.trim(),
      'standard': _selectedStandard ?? '',
      'interest': _selectedInterest ?? '',
      'state': _stateController.text.trim(),
      'district': _districtController.text.trim(),
      'address': _addressController.text.trim(),
      'phone': _phoneController.text.trim(),
      'school_name': _schoolNameController.text.trim(),
      'school_address': _schoolAddressController.text.trim(),
    };

    if (entered == _generatedOTP || entered == '123456') {
      await ref.read(authProvider.notifier).verifyEmailOTP(
            email: _emailController.text.trim(),
            otp: entered,
            details: details,
          );
      if (mounted) {
        context.go('/home');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Colors.redAccent,
          content: Text('Invalid Code. Use the code shown on screen or "123456".'),
        ),
      );
    }
  }

  int _currentVisionaryIndex = 0;

  final List<Map<String, String>> _visionaries = const [
    {
      'title': 'SkillVerse AI — Education for All',
      'quote': 'Empowering learners globally with real-time AI dubbing, automated document translations, and interactive live classrooms.',
      'translation': 'Accessible, high-quality vocational education for every student in their preferred native language.',
      'author': 'Education for all',
      'image': '',
    },
  ];

  void _nextVisionary() {
    setState(() {
      _currentVisionaryIndex = (_currentVisionaryIndex + 1) % _visionaries.length;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0A0E1A), // Deep Midnight Slate
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16),
            child: _showOTP
                ? _buildOTPView(theme)
                : _buildRegistrationView(theme),
          ),
        ),
      ),
    );
  }

  // ───── Step 1: Basic Details Form ─────
  Widget _buildRegistrationView(ThemeData theme) {
    final currentVisionary = _visionaries[_currentVisionaryIndex];

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 💎 Modern Hero Header Banner - Education for All
          Container(
            height: 140,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF4F46E5),
                  Color(0xFF7C3AED),
                  Color(0xFF2563EB),
                ],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6366F1).withOpacity(0.3),
                  blurRadius: 20,
                  spreadRadius: 1,
                ),
              ],
            ),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    const Color(0xFF0A0E1A).withOpacity(0.85),
                    Colors.transparent,
                  ],
                ),
              ),
              padding: const EdgeInsets.all(16),
              alignment: Alignment.bottomLeft,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withOpacity(0.4)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.auto_awesome, color: Colors.amberAccent, size: 12),
                        SizedBox(width: 4),
                        Text(
                          'EDUCATION FOR ALL',
                          style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    currentVisionary['title']!,
                    style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // 📜 Dual-Tone Tamil & Indian Educational Quote Showcase Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF1E1B4B).withOpacity(0.8),
                  const Color(0xFF0F172A).withOpacity(0.8),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF06B6D4).withOpacity(0.4)),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF06B6D4).withOpacity(0.1),
                  blurRadius: 16,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  currentVisionary['quote']!,
                  style: const TextStyle(
                    color: Color(0xFF38BDF8),
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    fontStyle: FontStyle.italic,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  currentVisionary['translation']!,
                  style: const TextStyle(color: Colors.white70, fontSize: 11),
                ),
                const SizedBox(height: 6),
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    '— ${currentVisionary['author']}',
                    style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Full Name
          CustomInput(
            labelText: 'Full Name',
            controller: _nameController,
            prefixIcon: Icons.person_outline,
            validator: (v) =>
                v == null || v.isEmpty ? 'Name is required' : null,
          ),
          const SizedBox(height: 16),

          // Standard of Studying
          DropdownButtonFormField<String>(
            value: _selectedStandard,
            style: const TextStyle(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              labelText: 'Standard of Studying',
              prefixIcon: const Icon(Icons.school_outlined, size: 20),
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
            hint: const Text('Select Standard',
                style: TextStyle(color: Colors.white38)),
            items: _standards
                .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                .toList(),
            onChanged: (v) => setState(() => _selectedStandard = v),
          ),
          const SizedBox(height: 16),

          // Area of Interest / Topic Admired
          DropdownButtonFormField<String>(
            value: _selectedInterest,
            style: const TextStyle(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              labelText: 'Area of Interest / Admired Topic',
              prefixIcon:
                  const Icon(Icons.star_outline_rounded, size: 20),
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
            hint: const Text('Select Admired Topic',
                style: TextStyle(color: Colors.white38)),
            items: _interests
                .map((i) => DropdownMenuItem(value: i, child: Text(i)))
                .toList(),
            onChanged: (v) => setState(() => _selectedInterest = v),
          ),
          const SizedBox(height: 16),

          // State
          CustomInput(
            labelText: 'State',
            controller: _stateController,
            prefixIcon: Icons.map_outlined,
            validator: (v) =>
                v == null || v.isEmpty ? 'State is required' : null,
          ),
          const SizedBox(height: 16),

          // District
          CustomInput(
            labelText: 'District',
            controller: _districtController,
            prefixIcon: Icons.location_city_outlined,
            validator: (v) =>
                v == null || v.isEmpty ? 'District is required' : null,
          ),
          const SizedBox(height: 16),

          // Address
          CustomInput(
            labelText: 'Residential Address',
            controller: _addressController,
            prefixIcon: Icons.home_outlined,
            validator: (v) =>
                v == null || v.isEmpty ? 'Address is required' : null,
          ),
          const SizedBox(height: 16),

          // Phone Number
          CustomInput(
            labelText: 'Phone Number',
            controller: _phoneController,
            prefixIcon: Icons.phone_android_rounded,
            keyboardType: TextInputType.phone,
            validator: (v) => v == null || v.isEmpty || v.length < 10
                ? 'Enter a valid phone number'
                : null,
          ),
          const SizedBox(height: 16),

          // School Name
          CustomInput(
            labelText: 'School / Institute Name',
            controller: _schoolNameController,
            prefixIcon: Icons.domain_rounded,
            validator: (v) =>
                v == null || v.isEmpty ? 'School name is required' : null,
          ),
          const SizedBox(height: 16),

          // School Address
          CustomInput(
            labelText: 'School / Institute Address',
            controller: _schoolAddressController,
            prefixIcon: Icons.pin_drop_outlined,
            validator: (v) =>
                v == null || v.isEmpty ? 'School address is required' : null,
          ),
          const SizedBox(height: 24),

          CustomButton(
            text: 'Request Email Verification Code',
            onPressed: _requestOTP,
            isLoading: _isLoading,
            icon: Icons.mark_email_read_outlined,
          ),
        ],
      ),
    );
  }

  // ───── Step 2: Email Code Verification ─────
  Widget _buildOTPView(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Icon(Icons.mark_email_read_rounded,
            size: 64, color: Colors.deepPurpleAccent),
        const SizedBox(height: 16),
        Text(
          'Verify Email Address',
          textAlign: TextAlign.center,
          style: theme.textTheme.titleLarge
              ?.copyWith(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Text(
          'A 6-digit code was sent to ${_emailController.text.trim()}.\nEnter it below to activate your account.',
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.white54, fontSize: 13, height: 1.5),
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.deepPurpleAccent.withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.deepPurpleAccent.withOpacity(0.3)),
          ),
          child: Column(
            children: [
              const Text(
                '🔑 [EMAIL CODE DISPATCHED]',
                style: TextStyle(color: Colors.deepPurpleAccent, fontWeight: FontWeight.bold, fontSize: 12),
              ),
              const SizedBox(height: 4),
              Text(
                'Verification Code: $_generatedOTP',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 2),
              const Text(
                '(Or use master code "123456")',
                style: TextStyle(color: Colors.white38, fontSize: 11),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        CustomInput(
          labelText: '6-Digit Email Code',
          controller: _otpController,
          prefixIcon: Icons.vpn_key_outlined,
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 24),
        CustomButton(
          text: 'Verify Code & Access Workspace',
          onPressed: _verifyOTP,
          icon: Icons.verified_outlined,
        ),
        const SizedBox(height: 16),
        TextButton(
          onPressed: () => setState(() {
            _showOTP = false;
            _otpController.clear();
          }),
          child: const Text('Back to Profile Details',
              style: TextStyle(color: Colors.deepPurpleAccent)),
        ),
      ],
    );
  }
}
