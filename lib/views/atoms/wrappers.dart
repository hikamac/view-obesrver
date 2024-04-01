import 'package:flutter/material.dart';

abstract class Wrapper extends StatelessWidget {
  const Wrapper({
    super.key,
    this.margin = EdgeInsets.zero,
    this.padding = EdgeInsets.zero,
  });

  final EdgeInsetsGeometry margin;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
