const DEVTOOLS_KEY = '__hello__stent__';
var Machine = null;

const message = data => {
  window.postMessage({ source: 'stent', ...data }, '*');
}
const formatYielded = yielded => {
  var y = yielded;
  if (yielded.__type === 'call') {
    const funcName = yielded.func.name;
    y = JSON.parse(JSON.stringify(yielded));
    y.func = funcName;
  }
  return y;
}
const sanitize = something => {
  return JSON.parse(JSON.stringify(something));
}

(function findStent() {
  Machine = window[DEVTOOLS_KEY];
  if (Machine) {
    Machine.addMiddleware({
      onActionDispatched(actionName, ...args) {
        message({ type: 'onActionDispatched', actionName, args: sanitize(args), machine: sanitize(this) });
      },
      onActionProcessed(actionName, ...args) {
        message({ type: 'onActionProcessed', actionName, args: sanitize(args), machine: sanitize(this) });
      },
      onStateWillChange() {
        message({ type: 'onStateWillChange', machine: sanitize(this) });
      },
      onStateChanged() {
        message({ type: 'onStateChanged', machine: sanitize(this) });
      },
      onGeneratorStep(yielded) {
        message({ type: 'onGeneratorStep', yielded: formatYielded(yielded) });
      }
    });
  } else {
    setTimeout(findStent, 1000);
  }
})();