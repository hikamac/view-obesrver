import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/constants/color.dart';
import 'package:view_observer/constants/locales.dart';
import 'package:view_observer/providers/locale_provider.dart';

class LangSwitchIcon extends ConsumerWidget {
  const LangSwitchIcon({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DropdownButtonHideUnderline(
      child: DropdownButton<Locale>(
        icon: const Icon(
          Icons.language,
          color: white,
        ),
        isExpanded: false,
        items: supportedLocales.map(
          (locale) {
            return DropdownMenuItem(
              value: locale,
              child: Text(
                _getLangName(locale.languageCode),
                style: const TextStyle(color: black),
              ),
            );
          },
        ).toList(),
        onChanged: (selectedLocale) {
          if (selectedLocale != null) {
            ref
                .read(localeProvider.notifier)
                .changeLocale(context, selectedLocale);
          }
        },
        dropdownColor: Theme.of(context).colorScheme.background,
        alignment: Alignment.centerLeft,
        padding: const EdgeInsets.only(right: 20.0),
      ),
    );
  }

  String _getLangName(String langCode) {
    switch (langCode) {
      case "en":
        return "English";
      case "ja":
        return "日本語";
      default:
        return "";
    }
  }
}
