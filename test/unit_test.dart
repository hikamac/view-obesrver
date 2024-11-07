import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:view_observer/providers/navigation_state_provider.dart';
import 'package:view_observer/router/route_parser.dart';
import 'package:view_observer/router/route_path.dart';
import 'package:view_observer/router/router_delegator.dart';
import 'package:view_observer/views/pages/top_page.dart';

import 'firebase_test/mock.dart';

class MockWidgetRef extends Mock implements WidgetRef {}

void main() {
  setupFirebaseAuthMocks();
  setUpAll(() async => await Firebase.initializeApp());

  group("RouteInfoParser", () {
    final parser = RouteInfoParser();

    test("parses top page route collectly", () async {
      final routeInformation = RouteInformation(uri: Uri.parse("/"));
      final parseResult = await parser.parseRouteInformation(routeInformation);
      expect(parseResult, isA<TopPagePath>());
    });

    test("parses SNS links page route collectly", () async {
      final routeInformation = RouteInformation(uri: Uri.parse("/pubsearch"));
      final parseResult = await parser.parseRouteInformation(routeInformation);
      expect(parseResult, isA<SNSLinksPagePath>());
      expect(parseResult, isNot(isA<TopPagePath>()));
    });
  });

  group("RouterDelegator", () {
    testWidgets("Builds TopPage for TopPagePath", (tester) async {
      final mockRef = MockWidgetRef();
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp.router(
            routeInformationParser: RouteInfoParser(),
            routerDelegate: RouterDelegator(mockRef),
          ),
        ),
      );

      await tester.pumpAndSettle();
      expect(find.byType(TopPage), findsOneWidget);
    });

    testWidgets("Navigates through multiple pages", (tester) async {
      final mockRef = MockWidgetRef();
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp.router(
            routeInformationParser: RouteInfoParser(),
            routerDelegate: RouterDelegator(mockRef),
          ),
        ),
      );

      await tester.pumpAndSettle();
      expect(find.byType(TopPage), findsOneWidget);

      mockRef.read(navigationStateProvider.notifier).state = SNSLinksPagePath();
      await tester.pumpAndSettle();
    });
  });
}
