abstract class RoutePath {
  Uri uri;
  RoutePath(String path) : uri = Uri(path: path);
}

class TopPagePath extends RoutePath {
  TopPagePath() : super("/${TopPagePath.path}");
  static const path = "";
}

class NewsListPath extends RoutePath {
  NewsListPath() : super("/${NewsListPath.path}");
  static const path = "news";
}
