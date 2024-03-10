import 'package:flutter_riverpod/flutter_riverpod.dart';

final videoPlayProvider =
    StateProvider.family.autoDispose<bool, String>((ref, videoId) => false);
