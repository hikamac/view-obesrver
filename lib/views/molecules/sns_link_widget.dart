import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:view_observer/constants/color.dart';
import 'package:view_observer/domain/models/sns_link.dart';

class SNSLinkWidget extends StatelessWidget {
  const SNSLinkWidget({
    super.key,
    required this.snsLink,
    this.margin = EdgeInsets.zero,
    this.padding = EdgeInsets.zero,
  });

  final SNSLink snsLink;
  final EdgeInsetsGeometry margin;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(4.0),
      elevation: 4.0,
      child: ListTile(
        title: Text(
          snsLink.name,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        onTap: () => _launchURL(snsLink.uri),
        tileColor: grey,
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
      ),
    );
  }

  void _launchURL(Uri uri) async {
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri,
          mode: LaunchMode.platformDefault, webOnlyWindowName: "_blank");
    } else {
      throw "could not launch $uri";
    }
  }
}
