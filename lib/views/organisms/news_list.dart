import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/apis/models/news.dart';
import 'package:view_observer/providers/service_provider.dart';

class NewsList extends ConsumerWidget {
  final limit = 10;
  String? lastViewedId;

  NewsList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final newsService = ref.watch(newsServiceProvider);

    return FutureBuilder(future: newsService.fetchNews(limit: limit, lastViewedId: lastViewedId), builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return const Center(child: CircularProgressIndicator());
      } else if (snapshot.hasError) {
        return Center(child: Text("Error: ${snapshot.error.toString()}"));
      } else {
        List<NewsDocument> newsList = snapshot.data!.news;
        return SizedBox(
          height: 300,
          child: ListView.builder(itemCount: newsList.length, itemBuilder: (_, index) {
            final news = newsList[index];
            return ListTile(
              title: Text(news.category),
              subtitle: Text(news.videoTitle),
            );          
          }),
        );
      }
    });
  }
}