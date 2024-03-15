import 'package:flutter/material.dart';
import 'package:view_observer/views/organisms/app_bar.dart';

class AppShell extends StatelessWidget {
  final Widget child;
  const AppShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const MyAppBar(),
      body: child,
    );
  }
}
