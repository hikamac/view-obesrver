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

  factory NewsListQueryResponse.fromJson(Map<String, dynamic> json) =>
      _$NewsListQueryResponseFromJson(json);

  Map<String, dynamic> toJson() => _$NewsListQueryResponseToJson(this);
}

@JsonSerializable()
class NewsDocument {
  @JsonKey(fromJson: _dateTimeFromTimestamp)
  final DateTime updated;
  final String videoId;
  final String videoTitle;
  @JsonKey(fromJson: _newsCategoryFromString)
  final NewsCategory category;
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

  factory NewsDocument.fromJson(Map<String, dynamic> json) =>
      _$NewsDocumentFromJson(json);

  Map<String, dynamic> toJson() => _$NewsDocumentToJson(this);

  /* properties getter */

  int? getMilestone() {
    if (properties != null) {
      return properties?["milestone"];
    }
    return null;
  }

  int? getViewCount() {
    if (properties != null) {
      return properties?["viewCount"];
    }
    return null;
  }

  DateTime? getPublishedAt() {
    if (properties != null) {
      String? publishedAt = properties?["publishedAt"];
      if (publishedAt != null) {
        return DateTime.parse(publishedAt);
      }
    }
    return null;
  }

  int? getRestDays() {
    if (properties != null) {
      return properties?["restDays"];
    }
    return null;
  }
}

enum NewsCategory {
  viewCountApproach,
  viewCountReached,
  anniversary;

  static NewsCategory of(String name) {
    switch (name) {
      case "VIEW_COUNT_APPROACH":
        return NewsCategory.viewCountApproach;
      case "VIEW_COUNT_REACHED":
        return NewsCategory.viewCountReached;
      case "ANNIVERSARY":
        return NewsCategory.anniversary;
      default:
        throw ArgumentError("illegal category: $name");
    }
  }
}

DateTime _dateTimeFromTimestamp(Map<String, dynamic> timestamp) {
  return DateTime.fromMillisecondsSinceEpoch(
      timestamp['_seconds'] * 1000 + timestamp['_nanoseconds'] ~/ 1000000);
}

NewsCategory _newsCategoryFromString(String category) {
  return NewsCategory.of(category);
}
