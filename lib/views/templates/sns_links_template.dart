import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/views/organisms/sns_link_list.dart';
import 'package:view_observer/views/templates/template_widget.dart';

class SNSLinksTemplate extends Template {
  const SNSLinksTemplate({super.key, this.ref});

  final WidgetRef? ref;

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;
    // double height = screenSize.height;
    double width = screenSize.width;
    return Center(
      child: SNSLinkList(
        padding: EdgeInsets.symmetric(
          horizontal: width * 0.2,
      ),
        ),
    );
  }
}
