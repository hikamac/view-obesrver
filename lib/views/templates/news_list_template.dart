import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/views/organisms/news_list.dart';
import 'package:view_observer/views/templates/template_widget.dart';

final newsCategoryProvider = StateProvider<String?>((ref) => null);

class NewsListTemplate extends Template {
  const NewsListTemplate({super.key, required this.ref});

  final WidgetRef ref;

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;
    double height = screenSize.height;
    double width = screenSize.width;
    bool isMobile = height > width;

    final category = ref.watch(newsCategoryProvider);

    return Center(
      child: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10.0),
              child: SizedBox(
                width: width * (isMobile ? 0.9 : 0.5),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        ref.read(newsCategoryProvider.notifier).state =
                            "VIEW_COUNT_APPROACH";
                      },
                      child: const Icon(Icons.trending_up),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        ref.read(newsCategoryProvider.notifier).state =
                            "VIEW_COUNT_REACHED";
                      },
                      child: const Icon(Icons.celebration),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        ref.read(newsCategoryProvider.notifier).state =
                            "ANNIVERSARY";
                      },
                      child: const Icon(Icons.cake),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        ref.read(newsCategoryProvider.notifier).state = null;
                      },
                      child: const Icon(Icons.filter_alt_off),
                    )
                  ],
                ),
              ),
            ),
            SizedBox(
              height: height * 0.8,
              width: width * (isMobile ? 0.9 : 0.5),
              child: NewsList(
                category: category,
                isMobile: isMobile,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
