import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/views/pages/page_widget.dart';
import 'package:view_observer/views/templates/sns_links_template.dart';
import 'package:view_observer/views/templates/template_widget.dart';

class SNSLinksPage extends PageWidget {
  const SNSLinksPage({super.key});

  @override
  Template build(BuildContext context, WidgetRef ref) {
    return SNSLinksTemplate(ref: ref);
  }
}
