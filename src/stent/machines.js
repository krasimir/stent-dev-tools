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
  // state: exampleState,
  transitions: {
    'working': {
      'action received': function ({ actions, ...rest }, action) {
        if (action.pageRefresh === true) {
          this.flushActions(action.origin);
          return;
        }
        actions.push(normalizeAction(action));
        return { ...rest, actions };
      },
      'flush actions': function ({ actions: oldActions }, newOrigin) {
        const actions = oldActions.filter(({ origin }) => origin !== newOrigin);

        return { actions, name: 'working', page: PAGES.LOG };
      }
    }
  }
});

// exposing this machine for development purposes
// setTimeout(() => {
//   console.log(JSON.stringify(machine.state, null, 2));
// }, 10000);