import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/languages.dart';
import '../../core/constants/app_translations.dart';
import '../../core/providers/language_provider.dart';
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
  final _emailController = TextEditingController();
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
    _emailController.dispose();
    _stateController.dispose();
    _districtController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _schoolNameController.dispose();
    _schoolAddressController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _showLanguageModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final currentLang = ref.watch(languageProvider);
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Select App & Login Language (23 Languages)',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white54),
                    onPressed: () => Navigator.pop(context),
                  )
                ],
              ),
              const Divider(color: Colors.white10),
              Flexible(
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: AppLanguages.supportedLanguages.length,
                  itemBuilder: (context, index) {
                    final lang = AppLanguages.supportedLanguages[index];
                    final nativeName = AppLanguages.nativeLanguageNames[lang] ?? lang;
                    final isSelected = lang == currentLang;

                    return ListTile(
                      dense: true,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      tileColor: isSelected ? Colors.deepPurple.withOpacity(0.3) : null,
                      leading: Icon(
                        Icons.translate_rounded,
                        color: isSelected ? Colors.deepPurpleAccent : Colors.grey,
                      ),
                      title: Text(lang, style: TextStyle(color: isSelected ? Colors.white : Colors.white70, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                      trailing: Text(nativeName, style: const TextStyle(color: Colors.amberAccent, fontSize: 13)),
                      onTap: () {
                        ref.read(languageProvider.notifier).setLanguage(lang);
                        Navigator.pop(context);
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _requestOTP() async {
    if (!_formKey.currentState!.validate()) return;
    final lang = ref.read(languageProvider);

    if (_selectedStandard == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppTranslations.translate('please_select_std', lang))),
      );
      return;
    }
    if (_selectedInterest == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppTranslations.translate('please_select_interest', lang))),
      );
      return;
    }

    setState(() => _isLoading = true);

    final email = _emailController.text.trim();
    final random = Random();
    final otp = (100000 + random.nextInt(900000)).toString();

    await ref.read(authProvider.notifier).requestEmailOTP(email);

    if (mounted) {
      setState(() {
        _generatedOTP = otp;
        _showOTP = true;
        _isLoading = false;
      });

      final codeNotice = AppTranslations.translate('enter_code', lang);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          duration: const Duration(seconds: 15),
          backgroundColor: Colors.deepPurpleAccent,
          content: Text(
            '🔑 [$codeNotice] Code: $otp — sent to $email',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
        ),
      );
    }
  }

  void _verifyOTP() async {
    final entered = _otpController.text.trim();
    final lang = ref.read(languageProvider);
    final validCodeErr = AppTranslations.translate('enter_code', lang);

    if (entered.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$validCodeErr (6 digits)')),
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
      final invalidCodeMsg = AppTranslations.translate('invalid_code_error', lang);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: Colors.redAccent,
          content: Text(invalidCodeMsg),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currentLang = ref.watch(languageProvider);
    final nativeName = AppLanguages.nativeLanguageNames[currentLang] ?? currentLang;

    return Scaffold(
      backgroundColor: const Color(0xFF0A0E1A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0, top: 8.0),
            child: ActionChip(
              avatar: const Icon(Icons.language_rounded, size: 16, color: Colors.amberAccent),
              label: Text(
                '$currentLang ($nativeName)',
                style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
              ),
              backgroundColor: const Color(0xFF1E293B),
              onPressed: () => _showLanguageModal(context),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8),
            child: _showOTP
                ? _buildOTPView(theme, currentLang)
                : _buildRegistrationView(theme, currentLang),
          ),
        ),
      ),
    );
  }

  Widget _buildRegistrationView(ThemeData theme, String lang) {
    final loginTitle = AppTranslations.translate('login_title', lang);
    final fullNameLabel = AppTranslations.translate('full_name', lang);
    final emailLabel = AppTranslations.translate('email_address', lang);
    final standardLabel = AppTranslations.translate('select_standard', lang);
    final interestLabel = AppTranslations.translate('admired_topic', lang);
    final stateLabel = AppTranslations.translate('state_label', lang);
    final districtLabel = AppTranslations.translate('district_label', lang);
    final addressLabel = AppTranslations.translate('address_label', lang);
    final phoneLabel = AppTranslations.translate('phone_label', lang);
    final schoolNameLabel = AppTranslations.translate('school_name_label', lang);
    final schoolAddressLabel = AppTranslations.translate('school_address_label', lang);
    final requestBtn = AppTranslations.translate('request_otp', lang);
    final requiredErr = AppTranslations.translate('required_error', lang);
    final validEmailErr = AppTranslations.translate('valid_email_error', lang);
    final validPhoneErr = AppTranslations.translate('valid_phone_error', lang);
    final preferredLangLabel = AppTranslations.translate('preferred_lang_label', lang);

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header Banner
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF4F46E5), Color(0xFF7C3AED), Color(0xFF2563EB)],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6366F1).withOpacity(0.3),
                  blurRadius: 20,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.auto_awesome, color: Colors.amberAccent, size: 16),
                    const SizedBox(width: 6),
                    Text(
                      'SkillVerse AI • $lang (${AppLanguages.nativeLanguageNames[lang] ?? lang})',
                      style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  loginTitle,
                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Preferred Language Selector Form Field (23 Languages)
          DropdownButtonFormField<String>(
            value: lang,
            style: const TextStyle(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              labelText: preferredLangLabel,
              prefixIcon: const Icon(Icons.language_rounded, size: 20, color: Colors.amberAccent),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
            hint: Text(preferredLangLabel, style: const TextStyle(color: Colors.white38)),
            items: AppLanguages.supportedLanguages.map((l) {
              final native = AppLanguages.nativeLanguageNames[l] ?? l;
              return DropdownMenuItem(
                value: l,
                child: Text('$l ($native)', style: const TextStyle(color: Colors.white)),
              );
            }).toList(),
            onChanged: (v) {
              if (v != null) {
                ref.read(languageProvider.notifier).setLanguage(v);
              }
            },
          ),
          const SizedBox(height: 16),

          // Full Name
          CustomInput(
            labelText: fullNameLabel,
            controller: _nameController,
            prefixIcon: Icons.person_outline,
            validator: (v) => v == null || v.isEmpty ? requiredErr : null,
          ),
          const SizedBox(height: 16),

          // Email Address
          CustomInput(
            labelText: emailLabel,
            controller: _emailController,
            prefixIcon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
            validator: (v) => v == null || v.isEmpty || !v.contains('@') ? validEmailErr : null,
          ),
          const SizedBox(height: 16),

          // Standard of Studying
          DropdownButtonFormField<String>(
            value: _selectedStandard,
            style: const TextStyle(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              labelText: standardLabel,
              prefixIcon: const Icon(Icons.school_outlined, size: 20),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
            hint: Text(standardLabel, style: const TextStyle(color: Colors.white38)),
            items: _standards.map((s) {
              final num = s.split(' ').last;
              final localizedStd = '$standardLabel $num';
              return DropdownMenuItem(value: s, child: Text(localizedStd));
            }).toList(),
            onChanged: (v) => setState(() => _selectedStandard = v),
          ),
          const SizedBox(height: 16),

          // Area of Interest
          DropdownButtonFormField<String>(
            value: _selectedInterest,
            style: const TextStyle(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              labelText: interestLabel,
              prefixIcon: const Icon(Icons.star_outline_rounded, size: 20),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
            hint: Text(interestLabel, style: const TextStyle(color: Colors.white38)),
            items: _interests.map((i) {
              return DropdownMenuItem(value: i, child: Text(i));
            }).toList(),
            onChanged: (v) => setState(() => _selectedInterest = v),
          ),
          const SizedBox(height: 16),

          // State
          CustomInput(
            labelText: stateLabel,
            controller: _stateController,
            prefixIcon: Icons.map_outlined,
            validator: (v) => v == null || v.isEmpty ? requiredErr : null,
          ),
          const SizedBox(height: 16),

          // District
          CustomInput(
            labelText: districtLabel,
            controller: _districtController,
            prefixIcon: Icons.location_city_outlined,
            validator: (v) => v == null || v.isEmpty ? requiredErr : null,
          ),
          const SizedBox(height: 16),

          // Address
          CustomInput(
            labelText: addressLabel,
            controller: _addressController,
            prefixIcon: Icons.home_outlined,
            validator: (v) => v == null || v.isEmpty ? requiredErr : null,
          ),
          const SizedBox(height: 16),

          // Phone Number
          CustomInput(
            labelText: phoneLabel,
            controller: _phoneController,
            prefixIcon: Icons.phone_android_rounded,
            keyboardType: TextInputType.phone,
            validator: (v) => v == null || v.isEmpty || v.length < 10 ? validPhoneErr : null,
          ),
          const SizedBox(height: 16),

          // School Name
          CustomInput(
            labelText: schoolNameLabel,
            controller: _schoolNameController,
            prefixIcon: Icons.domain_rounded,
            validator: (v) => v == null || v.isEmpty ? requiredErr : null,
          ),
          const SizedBox(height: 16),

          // School Address
          CustomInput(
            labelText: schoolAddressLabel,
            controller: _schoolAddressController,
            prefixIcon: Icons.pin_drop_outlined,
            validator: (v) => v == null || v.isEmpty ? requiredErr : null,
          ),
          const SizedBox(height: 24),

          CustomButton(
            text: requestBtn,
            onPressed: _requestOTP,
            isLoading: _isLoading,
            icon: Icons.mark_email_read_outlined,
          ),
        ],
      ),
    );
  }

  Widget _buildOTPView(ThemeData theme, String lang) {
    final title = AppTranslations.translate('verify_email_title', lang);
    final enterCodeLabel = AppTranslations.translate('enter_code', lang);
    final verifyBtn = AppTranslations.translate('verify_code', lang);
    final backBtn = AppTranslations.translate('back_to_details', lang);
    final codeSentNotice = AppTranslations.translate('code_sent_notice', lang);
    final activateNotice = AppTranslations.translate('activate_account_notice', lang);
    final emailDispatchedTag = AppTranslations.translate('email_code_dispatched', lang);
    final masterNotice = AppTranslations.translate('master_code_notice', lang);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Icon(Icons.mark_email_read_rounded, size: 64, color: Colors.deepPurpleAccent),
        const SizedBox(height: 16),
        Text(
          title,
          textAlign: TextAlign.center,
          style: theme.textTheme.titleLarge?.copyWith(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 8),
        Text(
          '$codeSentNotice (${_emailController.text.trim()})\n$activateNotice',
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
              Text(
                emailDispatchedTag,
                style: const TextStyle(color: Colors.deepPurpleAccent, fontWeight: FontWeight.bold, fontSize: 12),
              ),
              const SizedBox(height: 4),
              Text(
                'Code: $_generatedOTP',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 2),
              Text(
                masterNotice,
                style: const TextStyle(color: Colors.white38, fontSize: 11),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        CustomInput(
          labelText: enterCodeLabel,
          controller: _otpController,
          prefixIcon: Icons.vpn_key_outlined,
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 24),
        CustomButton(
          text: verifyBtn,
          onPressed: _verifyOTP,
          icon: Icons.verified_outlined,
        ),
        const SizedBox(height: 16),
        TextButton(
          onPressed: () => setState(() {
            _showOTP = false;
            _otpController.clear();
          }),
          child: Text(backBtn, style: const TextStyle(color: Colors.deepPurpleAccent)),
        ),
      ],
    );
  }

  String get nativeName => AppLanguages.nativeLanguageNames[ref.watch(languageProvider)] ?? ref.watch(languageProvider);
}
