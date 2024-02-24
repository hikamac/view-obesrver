
import 'package:shared_preferences/shared_preferences.dart';

SharedPreferences? prefs;

Future<void> setUpSharedPreference() async {
  prefs = await SharedPreferences.getInstance();
}

Future<void> setApiResult(String key, String json) async {
  final timestamp = DateTime.now().millisecondsSinceEpoch;
  await prefs!.setString(key, json);
  await prefs!.setInt("${key}_timestamp", timestamp);
}

Future<String?> loadCachedApiResultJson(String key, {int expiryMinutes = 60}) async {
  final expiryTimestamp = prefs!.getInt("${key}_timestamp");
  if (expiryTimestamp == null) {
    return null;
  }

  final now = DateTime.now().millisecondsSinceEpoch;
  if (now - expiryTimestamp > expiryMinutes * 60 * 1000) {
    // 1 hour has passed
    return null;
  }

  return prefs!.getString(key);
}