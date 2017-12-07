# Stent Dev Tools

Chrome extension to monitor state machines created by [Stent](https://github.com/krasimir/stent) library.

### Posting a message the extension

```js
window.top.postMessage({
  source: 'stent',
  time: (new Date()).getTime(),
  uid: 'foo',
  state: { bank: { money: 0 } },
  label: 'Take my money',
  icon: 'fa-money'
}, '*');
```

*`icon` value is could be picked from [here](http://fontawesome.io/icons/)*
