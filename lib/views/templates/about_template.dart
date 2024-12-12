import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:view_observer/views/templates/template_widget.dart';

class AboutTemplate extends Template {
  final bool dev;
  static const List updateHistories = ["0"];
  const AboutTemplate({super.key, this.dev = false});

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;
    double height = screenSize.height;
    return Center(
      child: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Align(
                alignment: Alignment.topCenter,
                child: Text(
                  "about.pageTitle",
                  style: Theme.of(context).textTheme.headlineMedium,
                ).tr(),
              ),
            ),
            RichText(
              text: TextSpan(
                children: [
                  TextSpan(
                    text: tr("common.siteTitle"),
                  ),
                  TextSpan(
                    text: tr("about.intro.1"),
                  ),
                  TextSpan(
                    text: tr("about.intro.bold"),
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  TextSpan(
                    text: tr("about.intro.2"),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Align(
                alignment: Alignment.topCenter,
                child: Text(
                  "about.updateHistory",
                  style: Theme.of(context).textTheme.headlineMedium,
                ).tr(),
              ),
            ),
            SizedBox(
              height: height * 0.5,
              child: ListView.builder(
                itemCount: updateHistories.length,
                itemBuilder: (context, index) {
                  return Align(
                      alignment: Alignment.topCenter,
                      child:
                          Text(tr("about.updateNote.${updateHistories[0]}")));
                },
              ),
            ),
            dev ? textForDeveloper() : const SizedBox.shrink(),
          ],
        ),
      ),
    );
  }

  Widget textForDeveloper() {
    return RichText(
      text: TextSpan(
        children: [
          TextSpan(text: tr("common.siteTitle")),
          const TextSpan(text: "のソースコードは"),
          TextSpan(
            text: "GitHub",
            style: const TextStyle(
              color: Colors.blue,
              decoration: TextDecoration.underline,
            ),
            recognizer: TapGestureRecognizer()
              ..onTap = () async {
                _launchGitHub();
              },
          ),
          const TextSpan(text: "で公開されています。"),
        ],
      ),
    );
  }

  void _launchGitHub() async {
    Uri uri = Uri.https("github.com", "/hikamac/view-observer");
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri,
          mode: LaunchMode.platformDefault, webOnlyWindowName: "_blank");
    }
  }
}
