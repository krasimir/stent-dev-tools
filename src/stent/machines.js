import { Machine } from 'stent';
import exampleState from '../_mocks/example.state.json';
import { PAGES } from '../constants';

const initialState = {
  name: 'working',
  page: PAGES.LOG,
  actions: []
};

const machine = Machine.create('DevTools', {
  // state: initialState,
  state: exampleState,
  transitions: {
    'working': {
      'action received': function ({ actions, ...rest }, action) {
        if (action.pageRefresh === true) {
          this.flushActions();
          return;
        }
        actions.push(action);
        return { ...rest, actions };
      },
      'flush actions': function () {
        return { actions: [], name: 'working', page: PAGES.LOG };
      }
    }
  }
});