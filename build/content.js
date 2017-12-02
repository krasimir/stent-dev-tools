chrome.runtime.sendMessage({ source: 'stent', pageRefresh: true, origin: location.href });
window.addEventListener('message', function(event) {
  const message = event.data;

  if (message.source !== 'stent') return;

  message.origin = location.href;
  chrome.runtime.sendMessage(message);
});