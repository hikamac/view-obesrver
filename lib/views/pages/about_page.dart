import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/views/pages/page_widget.dart';
import 'package:view_observer/views/templates/about_template.dart';
import 'package:view_observer/views/templates/template_widget.dart';

class AboutPage extends PageWidget {
  const AboutPage({super.key});

  @override
  Template build(BuildContext context, WidgetRef ref) {
    return const AboutTemplate();
  }
}
