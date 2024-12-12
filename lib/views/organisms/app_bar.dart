import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/views/molecules/lang_switch_icon.dart';

class MyAppBar extends ConsumerWidget implements PreferredSizeWidget {
  final String? title;
  final List<Widget>? actions;
  const MyAppBar({super.key, this.title, this.actions});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AppBar(
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      title: Text(title ?? ""),
      actions: actions ??
          [
            const LangSwitchIcon(),
            const Padding(padding: EdgeInsets.symmetric(horizontal: 20.0))
          ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
