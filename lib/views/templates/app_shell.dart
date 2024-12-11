import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:view_observer/views/organisms/app_bar.dart';
import 'package:view_observer/views/organisms/side_bar.dart';

class AppShell extends StatelessWidget {
  final Widget child;
  const AppShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(
        title: tr("common.siteTitle"),
      ),
      body: child,
      drawer: const SideBar(),
    );
  }
}
