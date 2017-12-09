import { Machine } from 'stent';
import exampleState from '../_mocks/example.state.json';
import exampleStateRedux from '../_mocks/example.redux.json';
import exampleStateSaga from '../_mocks/example.saga.json';
import { PAGES } from '../constants';
import { normalizeEvent } from '../helpers/normalize';

const initialState = {
  name: 'working',
  page: PAGES.DASHBOARD,
  events: []
};
const MAX_EVENTS = 500;

const machine = Machine.create('DevTools', {
  state: initialState,
  transitions: {
    'working': {
      'action received': function ({ events, ...rest }, event) {
        if (event.pageRefresh === true) {
          this.flushEvents();
          return undefined;
        }
        if (typeof event.type === 'undefined' || typeof event.uid === 'undefined') {
          return undefined;
        }
        events.push(normalizeEvent(event));
        if (events.length > MAX_EVENTS) {
          events.shift();
        }

        return { ...rest, events };
      },
      'flush events': function () {
        return { events: [], name: 'working', page: PAGES.DASHBOARD };
      },
      'add marker': function ({ events, ...rest }, index) {
        if (index === null) {
          events[events.length - 1].withMarker = true;
        } else {
          events[index].withMarker = true;
        }
        return { ...rest, events };
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
    } else if (window.location.href.indexOf('populate=3') > 0) {
      s = exampleStateSaga;
    }

    setTimeout(function () {
      console.log('About to inject ' + s.actions.length + ' actions');
      s.actions.forEach((action, i) => {
        setTimeout(() => {
          machine.actionReceived(action);
        }, i * 10);
      });
    }, 20);
  };
}
