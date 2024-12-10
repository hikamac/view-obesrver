import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:view_observer/constants/color.dart';
import 'package:view_observer/constants/locales.dart';
import 'package:view_observer/providers/locale_provider.dart';

class MyAppBar extends ConsumerWidget implements PreferredSizeWidget {
  final String? title;
  final List<Widget>? actions;
  const MyAppBar({super.key, this.title, this.actions});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeProvider);

    return AppBar(
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      title: Text(title ?? ""),
      actions: actions ??
          [
            DropdownButtonHideUnderline(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10.0),
                width: 150,
                child: DropdownButtonFormField<Locale>(
                  decoration: const InputDecoration(
                    prefixIcon: Icon(
                      Icons.language,
                      color: white,
                    ),
                    border: InputBorder.none,
                  ),
                  value: locale,
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
                ),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.language),
              onPressed: () async {
                final notifier = ref.read(localeProvider.notifier);
                if (locale.languageCode == "en") {
                  notifier.changeLocale(
                    context,
                    const Locale("ja", "JP"),
                  );
                } else {
                  notifier.changeLocale(
                    context,
                    const Locale("en", "US"),
                  );
                }
              },
            ),
          ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

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
