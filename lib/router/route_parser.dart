import 'package:flutter/material.dart';
import 'package:view_observer/router/route_path.dart';

class RouteInfoParser extends RouteInformationParser<RoutePath> {
  @override
  Future<RoutePath> parseRouteInformation(RouteInformation routeInformation) async {
    final uri = routeInformation.uri;

    if (uri.pathSegments.isEmpty) {
      return TopPagePath();
    }
    final segment = uri.pathSegments.first;
    switch (segment) {
      case "link":
        return SNSLinksPagePath();
      default:
        return UnknownPath();
    }
  }

  @override
  RouteInformation? restoreRouteInformation(RoutePath configuration) {
    if (configuration is UnknownPath) {
      return RouteInformation(uri: Uri.parse(UnknownPath().path));
    }
    if (configuration is TopPagePath) {
       return RouteInformation(uri: Uri.parse(TopPagePath().path));
    }
    if (configuration is SNSLinksPagePath) {
      return RouteInformation(uri: Uri.parse(SNSLinksPagePath().path));
    }

    return null;
  }
}