import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/views/templates/template_widget.dart';

/// An abstract class for page widgets.
///
/// Extend this class to create individual pages.
/// Implement the [build] method to return a [Template], ensuring
/// that every page follows the same layout set by templates.
abstract class PageWidget<T extends Template> extends ConsumerWidget {
  const PageWidget({super.key});

  @override
  T build(BuildContext context, WidgetRef ref);
}
