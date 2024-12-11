import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:view_observer/domain/models/sns_link.dart';
import 'package:view_observer/env/env.dart';
import 'package:view_observer/views/molecules/sns_link_widget.dart';

class SNSLinkList extends StatelessWidget {
  SNSLinkList(
      {super.key,
      this.margin = EdgeInsets.zero,
      this.padding = EdgeInsets.zero});
  final EdgeInsetsGeometry margin;
  final EdgeInsetsGeometry padding;

  final List<SNSLink> snsLinks = [
    SNSLink(
      name: tr("snsLink.x"),
      uri: Uri.https("twitter.com", "/search",
          {"q": Env.searchKeyword, "src": "typed_query", "f": "live"}),
    ),
    SNSLink(
        name: tr("snsLink.note"),
        uri: Uri.https("note.com", "/search",
            {"context": "note", "q": Env.searchKeyword, "sort": "new"})),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      padding: padding,
      child: ListView.builder(
        itemCount: snsLinks.length,
        itemBuilder: (context, index) {
          return SNSLinkWidget(
            snsLink: snsLinks[index],
            margin: const EdgeInsets.all(4.0),
          );
        },
      ),
    );
  }
}
