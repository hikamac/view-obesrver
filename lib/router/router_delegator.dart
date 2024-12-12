import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/providers/navigation_state_provider.dart';
import 'package:view_observer/router/route_path.dart';
import 'package:view_observer/views/templates/app_shell.dart';

class RouterDelegator extends RouterDelegate<RoutePath>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<RoutePath> {
  @override
  final GlobalKey<NavigatorState> navigatorKey;
  final WidgetRef ref;
  RoutePath _currentPath;
  RouterDelegator(this.ref)
      : navigatorKey = GlobalKey<NavigatorState>(),
        _currentPath = ref.read(navigationStateProvider) {
    ref.listen<RoutePath>(navigationStateProvider, (_, newPath) {
      _currentPath = newPath;
      notifyListeners();
    });
  }

  @override
  RoutePath? get currentConfiguration => _currentPath;

  @override
  Widget build(BuildContext context) {
    return Navigator(
      key: navigatorKey,
      pages: [
        MaterialPage(
          child: AppShell(
            child: _buildCurrentPage(),
          ),
        ),
      ],
      onPopPage: (route, result) {
        if (!route.didPop(result)) {
          return false;
        }

        _onPopPage.call();
        return true;
      },
    );
  }

  Widget _buildCurrentPage() {
    return _currentPath.pageWidget;
  }

  @override
  Future<void> setNewRoutePath(configuration) async {
    _currentPath = configuration;
    notifyListeners();
  }

  void _onPopPage() {
    if (_currentPath is SNSLinksPagePath) {
      _currentPath = TopPagePath();
    } else if (_currentPath is AboutPagePath) {
      _currentPath = AboutPagePath();
    } else {
      _currentPath = TopPagePath();
    }
    notifyListeners();
  }
}
