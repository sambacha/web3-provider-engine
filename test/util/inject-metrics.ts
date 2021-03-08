export default function injectSubproviderMetrics(subprovider): any {
  subprovider.getWitnessed = getWitnessed.bind(subprovider);
  subprovider.getHandled = getHandled.bind(subprovider);

  subprovider.clearMetrics = () => {
    subprovider.payloadsWitnessed = {};
    subprovider.payloadsHandled = {};
  };

  subprovider.clearMetrics();

  const _super = subprovider.handleRequest.bind(subprovider);
  subprovider.handleRequest = handleRequest.bind(subprovider, _super);

  return subprovider;
}

function getWitnessed(method) {
  const witnessed = this.payloadsWitnessed[method] = this.payloadsWitnessed[method] || [];
  return witnessed;
}

function getHandled(method) {
  const witnessed = this.payloadsHandled[method] = this.payloadsHandled[method] || [];
  return witnessed;
}

function handleRequest(_super, payload, next, end) {
  // mark payload witnessed
  const witnessed = this.getWitnessed(payload.method);
  witnessed.push(payload);
  // continue
  _super(payload, next, (err, result) => {
    // mark payload handled
    const handled = this.getHandled(payload.method);
    handled.push(payload);
    // continue
    end(err, result);
  });
}
