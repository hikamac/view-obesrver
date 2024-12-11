import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/constants/color.dart';
import 'package:view_observer/providers/navigation_state_provider.dart';
import 'package:view_observer/router/route_path.dart';

class SideBar extends ConsumerWidget {
  const SideBar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const DrawerHeader(
            child: Text(
              "",
              style: TextStyle(color: grey),
            ),
          ),
          ListTile(
            title: const Text("news.pageTitle").tr(),
            onTap: () {
              ref.read(navigationStateProvider.notifier).setPath(TopPagePath());
              Navigator.pop(context);
            },
          ),
          ListTile(
            title: const Text("snsLink.pageTitle").tr(),
            onTap: () {
              ref
                  .read(navigationStateProvider.notifier)
                  .setPath(SNSLinksPagePath());
              Navigator.pop(context);
            },
          ),
          ListTile(
            title: const Text("about.pageTitle").tr(),
            onTap: () {
              ref
                  .read(navigationStateProvider.notifier)
                  .setPath(AboutPagePath());
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}
