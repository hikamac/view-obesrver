import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/views/organisms/news_list.dart';

class NewsListTemplate extends ConsumerWidget {
  const NewsListTemplate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    Size screenSize = MediaQuery.of(context).size;
    double height = screenSize.height * 0.2;
    double width = screenSize.width * 0.5;
    return Center(
      child: Column(
        children: [
          SizedBox(
            height: height,
            width: width,
            child: NewsList(),
          ),
        ],
      ),
    );
  }
}
