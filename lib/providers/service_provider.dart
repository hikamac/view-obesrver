import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:view_observer/apis/functions/news_service.dart';

final sharedPreferenceProvider = FutureProvider((ref) async => await SharedPreferences.getInstance());

final newsServiceProvider = Provider<NewsService>((ref) => NewsService(FirebaseFunctions.instanceFor(region: 'asia-northeast1')));

