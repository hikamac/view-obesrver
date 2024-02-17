import 'package:cloud_functions/cloud_functions.dart';
import 'package:view_observer/apis/models/news.dart';

class NewsService {
  final FirebaseFunctions _functions;

  NewsService(this._functions);

  Future<NewsListQueryResponse> fetchNews({int limit = 20, String? lastViewedId}) async {
    final callable = _functions.httpsCallable('news');
    final response = await callable.call({
      'limit': limit,
      'lastViewedId': lastViewedId
    });
    return NewsListQueryResponse.fromJson(Map<String, dynamic>.from(response.data));
  }
}
