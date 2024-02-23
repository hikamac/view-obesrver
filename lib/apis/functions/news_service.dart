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
      // return NewsListQueryResponse.fromJson(cachedJson);
    }

    final callable = _functions.httpsCallable(name);
    final response =
        await callable.call({"limit": limit, "lastViewedId": lastViewedId});

    return NewsListQueryResponse.fromJson(response.data);
  }
}
