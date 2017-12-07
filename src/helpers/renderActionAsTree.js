import renderJSON from './renderJSON';
import formatMilliseconds from './formatMilliseconds';

export default function renderActionAsTree({ source, time, machines, origin, index, uid, ...rest } = {}, actions) {
  if (typeof source === 'undefined') return null;

  const diff = time - actions[0].time;

  return renderJSON({
    time: '+' + formatMilliseconds(diff),
    ...rest
  }, 'Event');
};
