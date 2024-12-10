import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:view_observer/apis/models/news.dart';

class NewsListTile extends StatelessWidget {
  final NewsDocument news;
  const NewsListTile({super.key, required this.news});

  @override
  Widget build(BuildContext context) {
    late IconData iconData;
    late String title;
    switch (news.category) {
      case NewsCategory.viewCountApproach:
        iconData = Icons.trending_up;
        title = "news.viewCountApproach".tr(namedArgs: {
          "video": news.videoTitle,
          "count": "${news.getMilestone()}"
        });
      case NewsCategory.viewCountReached:
        iconData = Icons.celebration;
        title = "news.viewCountReached".tr(namedArgs: {
          "video": news.videoTitle,
          "count": "${news.getMilestone()}"
        });
      case NewsCategory.anniversary:
        iconData = Icons.cake;
        title = "news.anniversary".tr(namedArgs: {
          "video": news.videoTitle,
          "date": news.getFormattedPubDate()!,
        });
      default:
        return const ListTile(
          leading: Icon(Icons.info_outline),
        );
    }

    return ListTile(
      leading: Icon(iconData),
      title: Text(title),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20.0),
    );
  }
}
