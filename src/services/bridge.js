const listeners = [];
const bridge = {
  on: function (callback) {
    listeners.push(callback);
  }
};
const notify = message => listeners.forEach(f => f(message));
const wire = () => {
  if (!chrome || !chrome.runtime) return;

  chrome.runtime.onMessage.addListener(function (message) {
    notify(message);
  });
};

wire();

export default bridge;
