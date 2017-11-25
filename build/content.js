window.addEventListener('message', function(event) {
  if (event.source !== window) return;

  const message = event.data;

  if (message.source !== 'stent') return;
  
  chrome.runtime.sendMessage(message);
});

// injecting the script on the page
var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);