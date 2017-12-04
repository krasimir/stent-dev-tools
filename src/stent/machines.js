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
          return;
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
//   exampleState.actions.forEach(machine.actionReceived);
// }, 20);

// exposing this machine for development purposes
// setTimeout(() => {
//   console.log(JSON.stringify(machine.state, null, 2));
// }, 10000);