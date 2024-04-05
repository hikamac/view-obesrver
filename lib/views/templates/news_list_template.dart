import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/views/organisms/news_list.dart';
import 'package:view_observer/views/templates/template_widget.dart';

class NewsListTemplate extends Template {
  const NewsListTemplate({super.key, this.ref});

  final WidgetRef? ref;

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;
    double height = screenSize.height;
    double width = screenSize.width;
    return Center(
      child: Column(
        children: [
          SizedBox(
            height: height * 0.8,
            width: width * 0.5,
            child: const NewsList(),
          ),
        ],
      ),
    );
  }
}
