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
  pinnedEvent: null,
  autoscroll: true
});
const MAX_EVENTS = 500;

const machine = Machine.create('DevTools', {
  state: initialState(),
  transitions: {
    'working': {
      'action received': function ({ events, autoscroll, pinnedEvent, ...rest }, newEvents) {
        const eventsToAdd = newEvents.map(newEvent => {
          if (newEvent.pageRefresh === true) {
            events = [];
            return false;
          }
          if (typeof newEvent.type === 'undefined' || typeof newEvent.uid === 'undefined') {
            return false;
          }
          return normalizeEvent(newEvent);
        }).filter(newEvent => newEvent);

        if (eventsToAdd.length === 0) return undefined;

        events = events.concat(eventsToAdd);

        if (events.length > MAX_EVENTS) {
          events.splice(0, MAX_EVENTS - events.length);
        }

        if (autoscroll) {
          pinnedEvent = events[events.length - 1];
        }

        return {
          events,
          autoscroll,
          pinnedEvent,
          ...rest
        };
      },
      'flush events': function () {
        return initialState();
      },
      'add marker': function (state) {
        if (state.pinnedEvent) {
          state.pinnedEvent.withMarker = true;
        }
        return state;
      },
      'pin': function ({ events, pinnedEvent: currentPinnedEvent, ...rest }, id) {
        const event = this.getEventById(id);
        const autoscroll = event.id === events[events.length - 1].id;

        return {
          ...rest,
          autoscroll,
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
      console.log('About to inject ' + s.events.length + ' actions');
      machine.actionReceived(s.events);
    }, 20);
  };
}
