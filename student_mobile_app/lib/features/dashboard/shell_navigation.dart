import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ShellNavigation extends StatelessWidget {
  final Widget child;

  const ShellNavigation({super.key, required this.child});

  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith('/home')) return 0;
    if (location.startsWith('/search')) return 1;
    if (location.startsWith('/tutor')) return 2;
    if (location.startsWith('/live')) return 3;
    if (location.startsWith('/profile') || location.startsWith('/settings')) return 4;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/home');
        break;
      case 1:
        context.go('/search');
        break;
      case 2:
        context.go('/tutor');
        break;
      case 3:
        context.go('/live');
        break;
      case 4:
        context.go('/profile');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final selectedIndex = _calculateSelectedIndex(context);

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(
              color: theme.colorScheme.outline,
              width: 1.0,
            ),
          ),
        ),
        child: NavigationBar(
          selectedIndex: selectedIndex,
          onDestinationSelected: (idx) => _onItemTapped(idx, context),
          backgroundColor: theme.scaffoldBackgroundColor,
          indicatorColor: theme.primaryColor.withOpacity(0.15),
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          height: 68,
          destinations: [
            NavigationDestination(
              icon: const Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home, color: theme.primaryColor),
              label: 'Home',
            ),
            NavigationDestination(
              icon: const Icon(Icons.search_outlined),
              selectedIcon: Icon(Icons.search, color: theme.primaryColor),
              label: 'Search',
            ),
            NavigationDestination(
              icon: const Icon(Icons.psychology_outlined),
              selectedIcon: Icon(Icons.psychology, color: theme.primaryColor),
              label: 'AI Tutor',
            ),
            NavigationDestination(
              icon: const Icon(Icons.video_camera_front_outlined),
              selectedIcon: Icon(Icons.video_camera_front, color: theme.primaryColor),
              label: 'Live',
            ),
            NavigationDestination(
              icon: const Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person, color: theme.primaryColor),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
