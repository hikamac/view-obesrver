import 'dart:convert';

import 'package:cloud_functions/cloud_functions.dart';
import 'package:view_observer/apis/local_storage.dart';
import 'package:view_observer/apis/models/news.dart';

class NewsService {
  final FirebaseFunctions _functions;

  NewsService(this._functions);

  Future<NewsListQueryResponse> fetchNews(
      {int limit = 20, String? lastViewedId}) async {
    const String name = "news";
    final cachedJson = await loadCachedApiResultJson(name);
    if (cachedJson != null) {
      final Map<String, dynamic> decoded = json.decode(cachedJson);
      return NewsListQueryResponse.fromJson(decoded);
    }

    final callable = _functions.httpsCallable(name);
    final response =
        await callable.call({"limit": limit, "lastViewedId": lastViewedId});
    final encoded = json.encode(response.data);
    setApiResult(name, encoded);
    return NewsListQueryResponse.fromJson(response.data);
  }
}
