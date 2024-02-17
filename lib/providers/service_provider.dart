import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/apis/functions/news_service.dart';

final newsServiceProvider = Provider<NewsService>((ref) => NewsService(FirebaseFunctions.instanceFor(region: 'asia-northeast1')));