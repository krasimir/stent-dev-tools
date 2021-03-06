/* eslint-disable no-undef */

var messages = [];

chrome.runtime.sendMessage([{ pageRefresh: true }]);

window.addEventListener('message', function (event) {
  const message = event.data;

  message.origin = location.href;
  messages.push(message);

  window.requestAnimationFrame(function (timeStamp) {
    if (messages.length > 0) {
      chrome.runtime.sendMessage(messages);
      messages = [];
    }
  });
});
