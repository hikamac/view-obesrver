// import 'package:flutter/material.dart';
// import 'package:youtube_player_flutter/youtube_player_flutter.dart';

// class MyYouTubePlayer extends StatelessWidget {
//   final String videoId;
//   final EdgeInsetsGeometry? padding;
//   final EdgeInsetsGeometry? margin;

//   const MyYouTubePlayer({
//     super.key,
//     required this.videoId,
//     this.padding,
//     this.margin,
//   });

//   @override
//   Widget build(BuildContext context) {
//     YoutubePlayerController controller = YoutubePlayerController(
//       initialVideoId: videoId,
//       flags: const YoutubePlayerFlags(
//         autoPlay: false,
//         mute: true,
//       ),
//     );

//     return Container(
//       padding: padding ?? const EdgeInsets.all(0),
//       margin: margin ?? const EdgeInsets.all(0),
//       child: YoutubePlayer(
//         controller: controller,
//         showVideoProgressIndicator: true,
//         onReady: () => controller.addListener(() {}),
//       ),
//     );
//   }
// }
