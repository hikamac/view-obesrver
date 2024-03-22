import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/providers/navigation_state_provider.dart';
import 'package:view_observer/router/route_path.dart';
import 'package:view_observer/views/organisms/news_list.dart';

class NewsListTemplate extends StatelessWidget {
  final WidgetRef ref;
  const NewsListTemplate({super.key, required this.ref});

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
          ElevatedButton(
            onPressed: () {
                ref.read(navigationStateProvider.notifier)
                  .setPath(SNSLinksPagePath());
            },
            child: const Text("SNS Links Page"),
          ),
        ],
      ),
    );
  }
}
