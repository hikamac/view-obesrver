import 'package:flutter/material.dart';

class SNSLink {
  final String name;
  final Uri uri;
  final Icon? icon;

  SNSLink({
    required this.name,
    required this.uri,
    this.icon,
  });
}
