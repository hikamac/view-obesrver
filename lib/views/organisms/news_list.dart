import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/apis/models/news.dart';
import 'package:view_observer/providers/service_provider.dart';

// ignore: must_be_immutable
class NewsList extends ConsumerWidget {
  final limit = 10;
  String? lastViewedId;

  NewsList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final newsService = ref.watch(newsServiceProvider);

    return FutureBuilder(
        future: newsService.fetchNews(limit: limit, lastViewedId: lastViewedId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error.toString()}"));
          } else {
            List<NewsDocument> newsList = snapshot.data!.news;
            return SizedBox(
              height: 300,
              child: ListView.builder(
                  itemCount: newsList.length,
                  itemBuilder: (_, index) {
                    final news = newsList[index];
                    return _getNewsListTile(news);
                  }),
            );
          }
        });
  }

  ListTile _getNewsListTile(NewsDocument news) {
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
    );
  }
}
