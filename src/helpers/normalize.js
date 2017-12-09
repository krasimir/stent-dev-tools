import formatMilliseconds from './formatMilliseconds';

var INDEX = 0;
var timeOfLastReceivedEvent = {};
const getIndex = () => INDEX++;

export function normalizeEvent(event) {
  const lastTime = timeOfLastReceivedEvent[event.uid || 'nouid'];

  if (lastTime) {
    let diff = event.time - lastTime;

    if (diff > 0) {
      event.timeDiff = '+ ' + formatMilliseconds(diff);
    }
  }
  event.index = getIndex();

  if (event.uid && event.time) {
    timeOfLastReceivedEvent[event.uid] = event.time;
  }

  return event;
};
