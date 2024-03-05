import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/apis/models/news.dart';
import 'package:view_observer/providers/service_provider.dart';
import 'package:view_observer/views/molecules/news_list_tile.dart';

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
            return LimitedBox(
              maxHeight: 300,
              child: ListView.builder(
                    itemCount: newsList.length,
                    itemBuilder: (_, index) {
                      final news = newsList[index];
                      return _getNewsListTile(news);
                    }
              ),
            );
          }
        });
  }

  Widget _getNewsListTile(NewsDocument news) {
    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400),
        child: NewsListTile(news: news)
      ),
    );
  }
}
