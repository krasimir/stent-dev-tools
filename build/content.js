chrome.runtime.sendMessage({ source: 'stent', pageRefresh: true });
window.addEventListener('message', function(event) {
  const message = event.data;

  if (message.source !== 'stent') return;

  chrome.runtime.sendMessage(message);
});