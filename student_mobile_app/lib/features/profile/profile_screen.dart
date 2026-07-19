import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../widgets/custom_card.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  final List<Map<String, String>> _certificates = const [
    {"title": "DC Motor Installation Certification", "date": "Issued July 4, 2026", "id": "cert-1"},
    {"title": "Blueprint Safety Standards", "date": "Issued June 28, 2026", "id": "cert-2"},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authNotifier = ref.read(authProvider.notifier);
    final user = authNotifier.currentUser;
    final details = authNotifier.studentDetails;

    final displayName = details['name']?.isNotEmpty == true
        ? details['name']!
        : (user?.email?.split('@').first.toUpperCase() ?? 'SKILLVERSE MEMBER');

    final displaySub = details['phone']?.isNotEmpty == true
        ? details['phone']!
        : (user?.email ?? 'guest.user@skillverse.ai');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Workspace'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => context.push('/settings'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Student Profile header card
            CustomCard(
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: theme.primaryColor.withOpacity(0.15),
                    radius: 32,
                    child: Icon(Icons.person_rounded, color: theme.primaryColor, size: 36),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          displayName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          displaySub,
                          style: const TextStyle(color: Colors.white54, fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Student details grid (only shown when details are available)
            if (details.isNotEmpty) ...[
              Text(
                'Profile Details',
                style: theme.textTheme.titleLarge?.copyWith(fontSize: 16),
              ),
              const SizedBox(height: 12),
              CustomCard(
                child: Column(
                  children: [
                    _detailRow(Icons.school_outlined, 'Branch', details['branch'] ?? '-'),
                    const Divider(color: Colors.white10, height: 20),
                    _detailRow(Icons.star_outline_rounded, 'Interest', details['interest'] ?? '-'),
                    const Divider(color: Colors.white10, height: 20),
                    _detailRow(Icons.map_outlined, 'State', details['state'] ?? '-'),
                    const Divider(color: Colors.white10, height: 20),
                    _detailRow(Icons.location_city_outlined, 'District', details['district'] ?? '-'),
                    const Divider(color: Colors.white10, height: 20),
                    _detailRow(Icons.home_outlined, 'Address', details['address'] ?? '-'),
                    const Divider(color: Colors.white10, height: 20),
                    _detailRow(Icons.phone_android_rounded, 'Phone', details['phone'] ?? '-'),
                    const Divider(color: Colors.white10, height: 20),
                    _detailRow(Icons.domain_rounded, 'School', details['school_name'] ?? '-'),
                    const Divider(color: Colors.white10, height: 20),
                    _detailRow(Icons.pin_drop_outlined, 'School Addr.', details['school_address'] ?? '-'),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Performance metrics row
            Row(
              children: [
                Expanded(
                  child: CustomCard(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      children: [
                        Text('14', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: theme.primaryColor)),
                        const SizedBox(height: 4),
                        const Text('Hours Studied', style: TextStyle(color: Colors.white54, fontSize: 11)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: CustomCard(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      children: [
                        Text('88%', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: theme.primaryColor)),
                        const SizedBox(height: 4),
                        const Text('Quiz Average', style: TextStyle(color: Colors.white54, fontSize: 11)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: CustomCard(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      children: [
                        Text(_certificates.length.toString(), style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: theme.primaryColor)),
                        const SizedBox(height: 4),
                        const Text('Certificates', style: TextStyle(color: Colors.white54, fontSize: 11)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),

            // Certificates Section
            Text(
              'Earned Certificates',
              style: theme.textTheme.titleLarge?.copyWith(fontSize: 16),
            ),
            const SizedBox(height: 12),
            if (_certificates.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 24.0),
                  child: Text('Complete courses to earn certificates.', style: TextStyle(color: Colors.white38)),
                ),
              )
            else
              ..._certificates.map((cert) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: CustomCard(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Viewing certificate: ${cert["title"]}')),
                      );
                    },
                    child: Row(
                      children: [
                        const Icon(Icons.workspace_premium_rounded, color: Colors.amber, size: 28),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                cert["title"] ?? "",
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                cert["date"] ?? "",
                                style: const TextStyle(color: Colors.white38, fontSize: 11),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.white38),
                      ],
                    ),
                  ),
                );
              }),
            const SizedBox(height: 32),

            // Logout CTA Button
            OutlinedButton.icon(
              onPressed: () async {
                await authNotifier.signOut();
                context.go('/auth');
              },
              icon: const Icon(Icons.logout_rounded, color: Colors.redAccent),
              label: const Text('Log Out Account', style: TextStyle(color: Colors.redAccent)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.redAccent),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.deepPurpleAccent),
        const SizedBox(width: 12),
        SizedBox(
          width: 90,
          child: Text(label, style: const TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.w600)),
        ),
        Expanded(
          child: Text(value, style: const TextStyle(color: Colors.white, fontSize: 13)),
        ),
      ],
    );
  }
}
