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

  void _requestOTP() {
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

    // Simulate OTP generation and dispatch
    Future.delayed(const Duration(milliseconds: 800), () {
      final random = Random();
      final otp = (100000 + random.nextInt(900000)).toString();

      setState(() {
        _generatedOTP = otp;
        _showOTP = true;
        _isLoading = false;
      });

      // Show mock SMS delivery notification
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          duration: const Duration(seconds: 15),
          backgroundColor: Colors.deepPurpleAccent,
          content: Text(
            '🔑 [MOCK SMS] OTP for SkillVerse AI: $otp  —  sent to ${_phoneController.text.trim()}',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
        ),
      );
    });
  }

  void _verifyOTP() {
    final entered = _otpController.text.trim();
    if (entered.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter a valid 6-digit OTP.')),
      );
      return;
    }

    // Allow generated OTP OR master fallback code "123456" for ease of testing
    if (entered == _generatedOTP || entered == '123456') {
      final details = {
        'name': _nameController.text.trim(),
        'standard': _selectedStandard ?? '',
        'interest': _selectedInterest ?? '',
        'state': _stateController.text.trim(),
        'district': _districtController.text.trim(),
        'address': _addressController.text.trim(),
        'phone': _phoneController.text.trim(),
        'school_name': _schoolNameController.text.trim(),
        'school_address': _schoolAddressController.text.trim(),
      };

      ref.read(authProvider.notifier).signInWithDetailsAndOTP(details);
      context.go('/home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Colors.redAccent,
          content: Text('Invalid OTP. Use the code shown on screen or "123456".'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12),
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
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Icon(Icons.app_registration_rounded,
              size: 54, color: Colors.deepPurpleAccent),
          const SizedBox(height: 12),
          Text(
            'Student Registration',
            textAlign: TextAlign.center,
            style: theme.textTheme.titleLarge
                ?.copyWith(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          const Text(
            'Enter your details to receive a verification OTP on your phone.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white54, fontSize: 13),
          ),
          const SizedBox(height: 28),

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
            text: 'Request Verification OTP',
            onPressed: _requestOTP,
            isLoading: _isLoading,
            icon: Icons.sms_outlined,
          ),
        ],
      ),
    );
  }

  // ───── Step 2: OTP Verification ─────
  Widget _buildOTPView(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Icon(Icons.phonelink_ring_rounded,
            size: 64, color: Colors.deepPurpleAccent),
        const SizedBox(height: 16),
        Text(
          'Verify Phone Number',
          textAlign: TextAlign.center,
          style: theme.textTheme.titleLarge
              ?.copyWith(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Text(
          'An OTP was sent to ${_phoneController.text.trim()}.\nEnter it below to activate your account.',
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
                '🔑 [MOCK SMS RECEIVED]',
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
          labelText: '6-Digit OTP Code',
          controller: _otpController,
          prefixIcon: Icons.vpn_key_outlined,
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 24),
        CustomButton(
          text: 'Verify & Access Workspace',
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
