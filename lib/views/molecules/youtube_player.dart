import 'package:flutter/material.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';

class MyYouTubePlayer extends StatefulWidget {
  final String videoId;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;

  const MyYouTubePlayer({
    super.key,
    required this.videoId,
    this.padding,
    this.margin,
  });

  @override
  State<StatefulWidget> createState() => _MyYouTubePlayerState();
}

class _MyYouTubePlayerState extends State<MyYouTubePlayer> {
  late YoutubePlayerController controller;

  @override
  void initState() {
    super.initState();
    controller = YoutubePlayerController.fromVideoId(
      videoId: widget.videoId,
      params: const YoutubePlayerParams(
        mute: false,
        showControls: false,
        showFullscreenButton: false,
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    controller.close();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: widget.padding ?? const EdgeInsets.all(0),
      margin: widget.margin ?? const EdgeInsets.all(0),
      child: YoutubePlayer(
        controller: controller,
      ),
    );
  }

  void pauseVideo() {
    controller.pauseVideo();
  }
}
