import 'package:flutter/material.dart';
import 'package:view_observer/views/organisms/sns_link_list.dart';

class SNSLinksTemplate extends StatelessWidget {
  const SNSLinksTemplate({super.key});

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;
    // double height = screenSize.height;
    double width = screenSize.width;
    return Center(
      child: SNSLinkList(
        padding: EdgeInsets.symmetric(
          horizontal: width * 0.2,
        ),
      ),
    );
  }
}
