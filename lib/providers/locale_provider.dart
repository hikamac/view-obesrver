import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/constants/locales.dart';

class LocaleNotifier extends StateNotifier<Locale> {
  LocaleNotifier() : super(supportedLocales[0]);

  void changeLocale(BuildContext context, Locale locale) {
    context.setLocale(locale);
    state = locale;
  }
}

// The provider manages the locale state.
final localeProvider = StateNotifierProvider<LocaleNotifier, Locale>((ref) {
  return LocaleNotifier();
});
