import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:view_observer/views/templates/template_widget.dart';

class AboutTemplate extends Template {
  const AboutTemplate({super.key});

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;
    double height = screenSize.height;
    double width = screenSize.width;
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
            SizedBox(
              height: height * 0.8,
              child: RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: tr("about.intro1"),
                    ),
                    TextSpan(
                      text: tr("about.introBold"),
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    TextSpan(
                      text: tr("about.intro2"),
                    ),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
