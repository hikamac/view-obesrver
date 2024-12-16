const flavor = String.fromEnvironment('ENV', defaultValue: 'prod');

final EnvFlavor environment = () {
  switch (flavor) {
    case 'production':
      return EnvFlavor.prod;
    case 'staging':
    default:
      return EnvFlavor.stg;
  }
}();

/* */

enum EnvFlavor {
  prod(flavor: "production"),
  stg(flavor: "staging");

  final String _flavor;

  const EnvFlavor({required String flavor}) : _flavor = flavor;

  String get flavor => _flavor;
  bool get isProd => this == EnvFlavor.prod;
}
