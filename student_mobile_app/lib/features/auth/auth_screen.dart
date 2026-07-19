import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _supabase = Supabase.instance.client;
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isSignUp = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    setState(() => _isLoading = true);
    try {
      if (_isSignUp) {
        // Sign up with Supabase
        await _supabase.auth.signUp(
          email: _emailController.text.trim(),
          password: _passwordController.text.trim(),
          data: {'full_name': 'New Student', 'role': 'student'},
        );
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Verification link sent to email!')),
        );
      } else {
        // Sign in with Supabase
        await _supabase.auth.signInWithPassword(
          email: _emailController.text.trim(),
          password: _passwordController.text.trim(),
        );
        context.go('/home');
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Authentication Failed: ${error.toString()}')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _handleGoogleSignIn() async {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Google Sign-In Triggered (Mocked)')),
    );
    // Real implementation: _supabase.auth.signInWithOAuth(OAuthProvider.google);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Premium branding
              const Icon(Icons.rocket_launch_rounded, size: 64, color: Colors.deepPurpleAccent),
              const SizedBox(height: 16),
              Text(
                'SkillVerse AI',
                textAlign: TextAlign.center,
                style: theme.textTheme.titleLarge?.copyWith(fontSize: 32, letterSpacing: 1.2),
              ),
              const SizedBox(height: 8),
              const Text(
                'Learn in Your Language. Grow with AI.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white54, fontSize: 14),
              ),
              const SizedBox(height: 48),
              
              // Email Input
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Email Address',
                  prefixIcon: const Icon(Icons.email_outlined),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),
              
              // Password Input
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Password',
                  prefixIcon: const Icon(Icons.lock_outline),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 24),
              
              // Main Action Button
              ElevatedButton(
                onPressed: _isLoading ? null : _handleSubmit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.violet,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : Text(_isSignUp ? 'Create Student Account' : 'Sign In', style: const TextStyle(fontSize: 16, color: Colors.white)),
              ),
              const SizedBox(height: 16),
              
              // Google Login
              OutlinedButton.icon(
                onPressed: _handleGoogleSignIn,
                icon: const Icon(Icons.g_mobiledata, size: 28),
                label: const Text('Continue with Google'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  side: const BorderSide(color: Colors.white24),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 24),
              
              // Mode Toggle
              TextButton(
                onPressed: () => setState(() => _isSignUp = !_isSignUp),
                child: Text(
                  _isSignUp ? 'Already have an account? Sign In' : 'New to SkillVerse? Create an account',
                  style: const TextStyle(color: Colors.deepPurpleAccent),
                ),
              ),
              
              const Divider(color: Colors.white12, height: 32),
              
              // Guest Mode Action
              TextButton.icon(
                onPressed: () => context.go('/home'),
                icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white70),
                label: const Text('Explore as Guest', style: TextStyle(color: Colors.white70)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
