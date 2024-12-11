import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';
import 'package:view_observer/apis/local_storage.dart';
import 'package:view_observer/constants/locales.dart';
import 'package:view_observer/firebase_options.dart';
import 'package:view_observer/providers/locale_provider.dart';
import 'package:view_observer/router/route_parser.dart';
import 'package:view_observer/router/router_delegator.dart';
import 'package:view_observer/views/pages/top_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  await setUpSharedPreference();
  usePathUrlStrategy();

  await EasyLocalization.ensureInitialized();
  runApp(EasyLocalization(
      supportedLocales: supportedLocales,
      path: 'assets/translations',
      fallbackLocale: const Locale("ja", "JP"),
      child: ProviderScope(child: MyApp())));
}

class MyApp extends ConsumerWidget {
  MyApp({super.key});
  final _routeParser = RouteInfoParser();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeProvider);

    return MaterialApp.router(
      title: tr("common.siteTitle"),
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      routerDelegate: RouterDelegator(ref),
      routeInformationParser: _routeParser,
      locale: locale,
      supportedLocales: context.supportedLocales,
      localizationsDelegates: context.localizationDelegates,
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: const Center(child: TopPage()),
    );
  }
}
