import 'package:json_annotation/json_annotation.dart';

part 'news.g.dart';

@JsonSerializable()
class NewsListQueryResponse {
  final List<NewsDocument> news;
  final String lastViewedId;

  NewsListQueryResponse({
    required this.news,
    required this.lastViewedId,
  });

  factory NewsListQueryResponse.fromJson(Map<String, dynamic> json) => _$NewsListQueryResponseFromJson(json);
}

@JsonSerializable()
class NewsDocument {
  final DateTime updated;
  final String videoId;
  final String videoTitle;
  final String category;
  final Map<String, dynamic>? properties;
  final String? url;

  NewsDocument({
    required this.updated,
    required this.videoId,
    required this.videoTitle,
    required this.category,
    this.properties,
    this.url,
  });

  factory NewsDocument.fromJson(Map<String, dynamic> json) => _$NewsDocumentFromJson(json);
  
  Map<String, dynamic> toJson() => _$NewsDocumentToJson(this);
}
