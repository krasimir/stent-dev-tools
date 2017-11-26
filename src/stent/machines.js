import { Machine } from 'stent';
import exampleState from '../_mocks/example.state.json';
import { PAGES } from '../constants';

const initialState = {
  name: 'working',
  page: PAGES.LOG,
  actions: []
};

const machine = Machine.create('DevTools', {
  state: exampleState,
  transitions: {
    'working': {
      'action received': function ({ actions, ...rest }, action) {
        actions.push(action);
        console.log(action);
        return { ...rest, actions };
      }
    }
  }
});