/* eslint-disable no-undef */

window.addEventListener('message', function (event) {
  const message = event.data;

  message.origin = location.href;
  chrome.runtime.sendMessage(message);
});
