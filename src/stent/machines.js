import { Machine } from 'stent';
import { LOCATING_STENT, STENT_LOCATED } from './states';
import { DEVTOOLS_KEY } from 'stent/lib/constants';

const machine = Machine.create('DevTools', {
  state: { name: LOCATING_STENT },
  transitions: {
    [LOCATING_STENT]: {
      'locating': function () {
        
      }
    },
    [STENT_LOCATED]: {
      a: 'b'
    }
  }
});