import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
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
        title = "${news.videoTitle} is almost at ${news.getMilestone()} views!";
      case NewsCategory.viewCountReached:
        iconData = Icons.celebration;
        title = "${news.videoTitle} has hit over ${news.getMilestone()} views!";
      case NewsCategory.anniversary:
        iconData = Icons.cake;
        String formatted = DateFormat("MM/dd").format(news.getPublishedAt()!);
        title = "$formatted is the anniversary of ${news.videoTitle}!";
      default:
        return const ListTile(
          leading: Icon(Icons.info_outline),
        );
    }
    
    return ListTile(
          leading: Icon(iconData),
          title: Text(title),
          shape: const RoundedRectangleBorder(
            side: BorderSide(),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20.0),
    );
  }
}
