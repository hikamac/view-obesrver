import 'package:flutter/material.dart';
import 'package:view_observer/router/route_path.dart';

class RouterParser extends RouteInformationParser<RoutePath> {
  @override
  Future<RoutePath> parseRouteInformation(RouteInformation routeInformation) async {
    final uri = routeInformation.uri;
    if (uri.pathSegments.isEmpty) {
      return TopPagePath();
    } else if (uri.path == NewsListPath.path) {
      return NewsListPath();
    }
    
    return TopPagePath();
  }

  @override
  RouteInformation? restoreRouteInformation(RoutePath configuration) {
    return RouteInformation(uri: configuration.uri);
  }
}