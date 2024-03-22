abstract class RoutePath {
  String get path;
}

class TopPagePath extends RoutePath {
  @override
  String get path => "/";
}

class SNSLinksPagePath extends RoutePath {
  @override
  String get path => "/link";
}

class UnknownPath extends RoutePath {
  @override
  String get path => "/404";
}
