import 'package:flutter/material.dart';
import 'package:view_observer/router/route_path.dart';

class RouteParser extends RouteInformationParser<RoutePath> {
  @override
  Future<RoutePath> parseRouteInformation(RouteInformation routeInformation) async {
    final uri = routeInformation.uri;
    if (uri.pathSegments.isEmpty) {
      return TopPagePath();
    }
    final segment = uri.pathSegments.first;
    switch (segment) {
      case SNSLinksPagePath.path:
        return SNSLinksPagePath();
      case NewsListPath.path:
        return NewsListPath();
      default:
        return UnknownPath();
    }
  }

  @override
  RouteInformation? restoreRouteInformation(RoutePath configuration) {
    return RouteInformation(uri: configuration.uri);
  }
}