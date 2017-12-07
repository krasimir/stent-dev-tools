import { Machine } from 'stent';
import exampleState from '../_mocks/example.state.json';
import { PAGES } from '../constants';
import { normalizeAction } from '../helpers/normalize';

const initialState = {
  name: 'working',
  page: PAGES.LOG,
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
        return { actions: [], name: 'working', page: PAGES.LOG };
      }
    }
  }
});

// setTimeout(function () {
//   console.log('About to inject ' + exampleState.actions.length + ' actions');
//   exampleState.actions.forEach((action, i) => {
//     setTimeout(() => machine.actionReceived(action), i * 10);
//   });
// }, 20);

// exposing this machine for development purposes
// setTimeout(() => {
//   console.log(JSON.stringify(machine.state, null, 2));
// }, 10000);

// Extension navigation
Machine.create('Nav', {
  state: { name: 'state' },
  transitions: {
    'state': {
      'view action': 'action',
      'view machines': 'machines'
    },
    'action': {
      'view state': 'state',
      'view machines': 'machines'
    },
    'machines': {
      'view state': 'state',
      'view action': 'action'
    }
  }
});
