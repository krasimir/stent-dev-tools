const messages = {};

window.addEventListener('message', function (event) {
  const message = event.data;

  if (message.source !== 'stent') return;

  if (messages[event.data.uid]) return;
  messages[event.data.uid] = true;

  message.origin = location.href;
  chrome.runtime.sendMessage(message);
});
