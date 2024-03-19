import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/router/route_path.dart';
import 'package:view_observer/router/router_delegator.dart';
import 'package:view_observer/views/organisms/news_list.dart';

class NewsListTemplate extends ConsumerWidget {
  const NewsListTemplate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
                final routerDelegator = Router.of(context).routerDelegate as RouterDelegator;
                routerDelegator.navigateTo(SNSLinksPagePath());
            },
            child: const Text("SNS Links Page"),
          ),
        ],
      ),
    );
  }
}
