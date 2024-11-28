import 'package:view_observer/views/pages/about_page.dart';
import 'package:view_observer/views/pages/page_widget.dart';
import 'package:view_observer/views/pages/sns_links_page.dart';
import 'package:view_observer/views/pages/top_page.dart';
import 'package:view_observer/views/templates/template_widget.dart';

/// An abstract class representing a route path within the application.
///
/// It defines a contract for derived classes to provide a specific path
/// and the associated page widget that should be displayed when navigating
/// to that path.
abstract class RoutePath {
  String get path;
  PageWidget get pageWidget;
}

class TopPagePath extends RoutePath {
  @override
  String get path => "/";

  @override
  PageWidget<Template> get pageWidget => const TopPage();
}

class SNSLinksPagePath extends RoutePath {
  @override
  String get path => "/link";

  @override
  PageWidget<Template> get pageWidget => const SNSLinksPage();
}

class AboutPagePath extends RoutePath {
  @override
  String get path => "/about";

  @override
  PageWidget<Template> get pageWidget => const AboutPage();
}

class UnknownPath extends RoutePath {
  @override
  String get path => "/404";

  @override
  PageWidget<Template> get pageWidget => const TopPage();
}
