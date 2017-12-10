import { Machine } from 'stent';
import exampleState from '../_mocks/example.state.json';
import exampleStateRedux from '../_mocks/example.redux.json';
import exampleStateSaga from '../_mocks/example.saga.json';
import exampleStateSagaShort from '../_mocks/example.saga.short.json';
import { PAGES } from '../constants';
import { normalizeEvent } from '../helpers/normalize';

const initialState = () => ({
  name: 'working',
  page: PAGES.DASHBOARD,
  events: [],
  pinnedEvent: null
});
const MAX_EVENTS = 500;

const machine = Machine.create('DevTools', {
  state: initialState(),
  transitions: {
    'working': {
      'action received': function ({ events, pinnedEvent: currentPinnedEvent, ...rest }, event) {
        if (event.pageRefresh === true) {
          this.flushEvents();
          return undefined;
        }
        if (typeof event.type === 'undefined' || typeof event.uid === 'undefined') {
          return undefined;
        }

        const normalizedEvent = normalizeEvent(event);

        const pinnedEvent = (
          currentPinnedEvent === null ||
          currentPinnedEvent.id === events[events.length - 1].id
        ) ? normalizedEvent : currentPinnedEvent;

        events.push(normalizedEvent);
        if (events.length > MAX_EVENTS) {
          events.shift();
        }

        return {
          ...rest,
          pinnedEvent,
          events
        };
      },
      'flush events': function () {
        return initialState();
      },
      'add marker': function ({ events, pinnedEvent, ...rest }) {
        if (pinnedEvent) {
          pinnedEvent.withMarker = true;
        }
      },
      'pin': function ({ events, pinnedEvent: currentPinnedEvent, ...rest }, id) {
        const event = this.getEventById(id);

        return {
          ...rest,
          pinnedEvent: event ? event : currentPinnedEvent,
          events
        };
      }
    }
  },
  getEventById(eventId) {
    return this.state.events.find(({ id }) => id === eventId);
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
    } else if (window.location.href.indexOf('populate=4') > 0) {
      s = exampleStateSagaShort;
    }

    setTimeout(function () {
      console.log('About to inject ' + s.actions.length + ' actions');
      s.actions.forEach((action, i) => {
        setTimeout(() => {
          machine.actionReceived(action);
        }, i);
      });
    }, 20);
  };
}
