import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/apis/models/news.dart';
import 'package:view_observer/providers/service_provider.dart';

class NewsList extends ConsumerWidget {
  final limit = 10;
  String? lastViewedId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final newsService = ref.watch(newsServiceProvider);

    return FutureBuilder(future: newsService.fetchNews(limit: limit, lastViewedId: lastViewedId), builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return const Center(child: CircularProgressIndicator());
      } else if (snapshot.hasError) {
        return Center(child: Text("Error: ${snapshot.error}"));
      } else {
        return ListView.builder(itemCount: limit, itemBuilder: (_, index) {
          return _createNewsList(snapshot.data!);
        });
      }
    });
  }
  
  Widget _createNewsList(NewsListQueryResponse res) {
    lastViewedId = res.lastViewedId;
    final newsList = res.news;
    return ListView.builder(itemCount: limit, itemBuilder: (_, index) {
      final NewsDocument news = newsList[index];
      return ListTile(
        title: Text(news.category),
        subtitle: Text(news.videoTitle),
      );
    });
  }
}