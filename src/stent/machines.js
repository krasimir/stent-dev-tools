/* eslint-disable no-undef */

import { Machine } from 'stent';
import exampleState from '../_mocks/example.state.json';
import exampleStateRedux from '../_mocks/example.redux.json';
import { PAGES } from '../constants';
import { normalizeAction } from '../helpers/normalize';

const initialState = {
  name: 'working',
  page: PAGES.DASHBOARD,
  actions: []
};

const machine = Machine.create('DevTools', {
  state: initialState,
  transitions: {
    'working': {
      'action received': function ({ actions, ...rest }, action) {
        if (action.pageRefresh === true) {
          this.flushActions();
          return undefined;
        }
        action.index = actions.length;
        actions.push(normalizeAction(action));
        return { ...rest, actions };
      },
      'flush actions': function () {
        return { actions: [], name: 'working', page: PAGES.DASHBOARD };
      },
      'add marker': function ({ actions, ...rest }, index) {
        if (index === null) {
          actions[actions.length - 1].withMarker = true;
        } else {
          actions[index].withMarker = true;
        }
        return { ...rest, actions };
      }
    }
  }
});

// Extension navigation
Machine.create('Nav', {
  state: { name: 'state' },
  transitions: {
    'state': {
      'view event': 'event',
      'view analysis': 'analysis'
    },
    'event': {
      'view state': 'state',
      'view analysis': 'analysis'
    },
    'analysis': {
      'view state': 'state',
      'view event': 'event'
    }
  }
});

// shortcuts
Mousetrap.bind('ctrl+`', function (e) {
  console.log(JSON.stringify(machine.state, null, 2));
});

// development goodies
if (typeof window !== 'undefined' && window.location && window.location.href) {
  if (window.location.href.indexOf('populate=') > 0) {
    let s;

    if (window.location.href.indexOf('populate=1') > 0) {
      s = exampleState;
    } else if (window.location.href.indexOf('populate=2') > 0) {
      s = exampleStateRedux;
    }

    setTimeout(function () {
      console.log('About to inject ' + s.actions.length + ' actions');
      s.actions.forEach((action, i) => {
        setTimeout(() => machine.actionReceived(action), i * 10);
      });
    }, 20);
  };
}
