import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/views/organisms/news_list.dart';

class NewsListTemplate extends ConsumerWidget {
  const NewsListTemplate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        NewsList(),
      ],
    );
  }
}
