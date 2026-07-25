import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';

// Import screens (Scaffolded in features folder)
import '../../features/splash/splash_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../features/dashboard/shell_navigation.dart';
import '../../features/dashboard/home_screen.dart';
import '../../features/search/search_screen.dart';
import '../../features/courses/course_details_screen.dart';
import '../../features/video/video_player_screen.dart';
import '../../features/tutor/ai_tutor_screen.dart';
import '../../features/live/live_classes_screen.dart';
import '../../features/notes/notes_screen.dart';
import '../../features/flashcards/flashcards_screen.dart';
import '../../features/quiz/quiz_screen.dart';
import '../../features/notifications/notifications_screen.dart';
import '../../features/profile/profile_screen.dart';
import '../../features/settings/settings_screen.dart';
import '../../features/mentor/mentor_dashboard_screen.dart';
import '../../features/video/video_analysis_screen.dart';
import '../../features/classroom/live_classroom_screen.dart';
import '../../features/dashboard/fun_session_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/splash',
    redirect: (BuildContext context, GoRouterState state) {
      final isLoggingIn = state.matchedLocation == '/auth';
      final isSplashing = state.matchedLocation == '/splash';
      final isOnboarding = state.matchedLocation == '/onboarding';

      if (authState == AuthState.initializing) return null;

      // Unauthenticated users (non-guest) go to onboarding / auth
      if (authState == AuthState.unauthenticated) {
        if (isLoggingIn || isSplashing || isOnboarding) return null;
        return '/onboarding';
      }

      // Guest redirection guard checks
      if (authState == AuthState.guestMode) {
        final guestAllowedRoutes = [
          '/home', '/search', '/course', '/video', '/auth', '/onboarding'
        ];
        final currentRoute = state.matchedLocation;
        
        final isAllowed = guestAllowedRoutes.any((r) => currentRoute.startsWith(r));
        if (!isAllowed) {
          return '/auth';
        }
      }

      // Authenticated users should bypass login/splash
      if (authState == AuthState.authenticated && (isLoggingIn || isSplashing)) {
        return '/home';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/auth',
        builder: (context, state) => const LoginScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => ShellNavigation(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/search',
            builder: (context, state) => const SearchScreen(),
          ),
          GoRoute(
            path: '/tutor',
            builder: (context, state) => const AITutorScreen(),
          ),
          GoRoute(
            path: '/live',
            builder: (context, state) => const LiveClassesScreen(),
          ),
          GoRoute(
            path: '/notes',
            builder: (context, state) => const NotesScreen(),
          ),
          GoRoute(
            path: '/notifications',
            builder: (context, state) => const NotificationsScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsScreen(),
          ),
          GoRoute(
            path: '/mentor',
            builder: (context, state) => const MentorDashboardScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/video-analysis',
        builder: (context, state) => const VideoAnalysisScreen(),
      ),
      GoRoute(
        path: '/fun-session',
        builder: (context, state) => const FunSessionScreen(),
      ),
      GoRoute(
        path: '/classroom/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? 'unknown';
          return LiveClassroomScreen(sessionId: id);
        },
      ),
      GoRoute(
        path: '/course/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return CourseDetailsScreen(courseId: id);
        },
      ),
      GoRoute(
        path: '/video/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return VideoPlayerScreen(videoId: id);
        },
      ),
      GoRoute(
        path: '/flashcards/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return FlashcardsScreen(deckId: id);
        },
      ),
      GoRoute(
        path: '/quiz/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return QuizScreen(quizId: id);
        },
      ),
    ],
  );
});
