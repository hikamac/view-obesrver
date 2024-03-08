import 'package:flutter/material.dart';

class MyExpansionTile extends StatefulWidget {
  const MyExpansionTile({super.key,
    required this.title,
    this.subtitle,
    required this.children,
  });

  final Widget title;
  final Widget? subtitle;
  final List<Widget> children;

  @override
  State<MyExpansionTile> createState() => _MyExpansionTileState();
}

class _MyExpansionTileState extends State<MyExpansionTile> {
  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      title: widget.title,
      subtitle: widget.subtitle,
      children: widget.children,
    );
  }
}