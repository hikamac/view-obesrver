import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:view_observer/constants/color.dart';
import 'package:view_observer/domain/models/sns_link.dart';

class SNSLinksPage extends StatelessWidget {
  SNSLinksPage({super.key});

  final List<SNSLink> snsLinks = [
    SNSLink(
      name: "X",
      uri: Uri.https("twitter.com"),
    ),
    SNSLink(
        name: "note",
        uri: Uri.https("note.com", "/search",
            {"context": "note", "q": "", "sort": "new"})),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        itemCount: snsLinks.length,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.all(4.0),
            elevation: 4.0,
            child: ListTile(
              title: Text(
                snsLinks[index].name,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              onTap: () => _launchURL(snsLinks[index].uri),
              tileColor: grey,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0)),
            ),
          );
        });
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
