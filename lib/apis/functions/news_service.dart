import 'package:cloud_functions/cloud_functions.dart';
import 'package:view_observer/apis/models/news.dart';

class NewsService {
  final FirebaseFunctions functions;

  NewsService(this.functions);

  Future<NewsListQueryResponse> fetchNews({int limit = 20}) async {
    final callable = functions.httpsCallable('news');
    final response = await callable.call({
      'limit': limit,
    });
    return NewsListQueryResponse.fromJson(Map<String, dynamic>.from(response.data));
  }
}