import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/providers/navigation_state_provider.dart';
import 'package:view_observer/router/route_path.dart';
import 'package:view_observer/views/templates/news_list_template.dart';

class TopPage extends ConsumerWidget {
  const TopPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return 1 == 1
        ? Center(
            child: ElevatedButton(
              onPressed: () {
                ref
                    .read(navigationStateProvider.notifier)
                    .setPath(SNSLinksPagePath());
              },
              child: const Text("SNSLink"),
            ),
          )
        : NewsListTemplate(ref: ref);
  }
}
