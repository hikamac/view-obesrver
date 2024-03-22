import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/router/route_path.dart';

class NavigationStateNotifier extends StateNotifier<RoutePath> {
  NavigationStateNotifier() : super(TopPagePath());

  void setPath(RoutePath path) {
    state = path;
  }
}

final navigationStateProvider =
    StateNotifierProvider<NavigationStateNotifier, RoutePath>(
        (ref) => NavigationStateNotifier());
