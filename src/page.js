const listeners = [];
const page = {
  on: function(callback) {
    listeners.push(callback);
  }
}
const notify = message => listeners.forEach(f => f(message));

var port = chrome.extension.connect({ name: "stent-connection" });
// port.postMessage("Request Tab Data");
port.onMessage.addListener(function (message) {
  notify(message);
});

export default page;