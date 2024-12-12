import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:view_observer/apis/models/news.dart';

class NewsListTile extends StatelessWidget {
  final NewsDocument news;
  final bool isMobile;
  const NewsListTile({
    super.key,
    this.isMobile = false,
    required this.news,
  });

  @override
  Widget build(BuildContext context) {
    late IconData iconData;
    late TextSpan titleSpan;

    switch (news.category) {
      case NewsCategory.viewCountApproach:
        iconData = Icons.trending_up;
        titleSpan = TextSpan(
          style: DefaultTextStyle.of(context).style,
          children: [
            TextSpan(text: "news.viewCountApproach.prefix".tr()),
            TextSpan(
              text: news.videoTitle,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            TextSpan(
              text: "news.viewCountApproach.suffix".tr(
                namedArgs: {"count": "${news.getMilestone()}"},
              ),
            ),
          ],
        );
        break;

      case NewsCategory.viewCountReached:
        iconData = Icons.celebration;
        titleSpan = TextSpan(
          style: DefaultTextStyle.of(context).style,
          children: [
            TextSpan(text: "news.viewCountReached.prefix".tr()),
            TextSpan(
              text: news.videoTitle,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            TextSpan(
              text: "news.viewCountReached.suffix".tr(
                namedArgs: {"count": "${news.getMilestone()}"},
              ),
            ),
          ],
        );
        break;

      case NewsCategory.anniversary:
        iconData = Icons.cake;
        titleSpan = TextSpan(
          style: DefaultTextStyle.of(context).style,
          children: [
            TextSpan(
              text: "news.anniversary.prefix".tr(
                namedArgs: {"date": news.getFormattedPubDate()!},
              ),
            ),
            TextSpan(
              text: news.videoTitle,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            TextSpan(text: "news.anniversary.suffix".tr()),
          ],
        );
        break;

      default:
        return const ListTile(
          leading: Icon(Icons.info_outline),
        );
    }

    return ListTile(
      leading: Icon(iconData),
      title: RichText(text: titleSpan),
      contentPadding: EdgeInsets.symmetric(horizontal: isMobile ? 2.0 : 20.0),
    );
  }
}
