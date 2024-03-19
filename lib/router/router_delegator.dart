import 'package:flutter/material.dart';
import 'package:view_observer/router/route_path.dart';
import 'package:view_observer/views/pages/sns_links_page.dart';
import 'package:view_observer/views/pages/top_page.dart';
import 'package:view_observer/views/templates/app_shell.dart';

class RouterDelegator extends RouterDelegate<RoutePath>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<RoutePath> {
  @override
  final GlobalKey<NavigatorState> navigatorKey;
  RouterDelegator()
      : navigatorKey = GlobalKey<NavigatorState>(),
        _currentPath = TopPagePath();

  RoutePath _currentPath;
  @override
  RoutePath? get currentConfiguration => _currentPath;

  @override
  Widget build(BuildContext context) {
    return Navigator(
      key: navigatorKey,
      pages: [
        MaterialPage(
          key: const ValueKey("shell"),
          child: AppShell(child: _buildCurrentPage()),
        )
      ],
      onPopPage: (route, result) {
        if (!route.didPop(result)) {
          return false;
        }

        _handleRoutePathChanged(TopPagePath());
        return true;
      },
    );
  }

  Widget _buildCurrentPage() {
    switch (_currentPath.runtimeType) {
      case TopPagePath:
        return const TopPage();
      case SNSLinksPagePath:
        return SNSLinksPage();
      case NewsListPath:
        return const Placeholder();
      case UnknownPath:
        return const Placeholder();
    }
    return const TopPage();
  }

  @override
  Future<void> setNewRoutePath(configuration) async {
    _handleRoutePathChanged(configuration);
  }

  void _handleRoutePathChanged(RoutePath path) {
    if (path != _currentPath) {
      _currentPath = path;
      notifyListeners();
    }
  }

  /* */

  void navigateTo(RoutePath path) {
    if (path != _currentPath) {
      _currentPath = path;
      notifyListeners();
    }
  }
}
