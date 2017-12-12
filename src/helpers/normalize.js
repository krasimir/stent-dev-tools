import formatMilliseconds from './formatMilliseconds';

var INDEX = 0;
var timeOfLastReceivedEvent = null;
const getId = () => INDEX++;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const converted = result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null ;

  if (converted) {
    return `rgb(${ converted.r },${ converted.g },${ converted.b })`;
  }
  return hex;
}

export function normalizeEvent(event) {
  if (timeOfLastReceivedEvent) {
    let diff = event.time - timeOfLastReceivedEvent;

    if (diff > 0) {
      event.timeDiff = '+ ' + formatMilliseconds(diff);
    }
  }
  event.id = getId();

  if (event.time) {
    timeOfLastReceivedEvent = event.time;
  }
  if (event.color && event.color.indexOf('#') === 0) {
    event.color = hexToRgb(event.color);
  }

  return event;
};
