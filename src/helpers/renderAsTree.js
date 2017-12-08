import getMachineName from './getMachineName';
import renderJSON from './renderJSON';
import formatMilliseconds from './formatMilliseconds';

export function renderMachinesAsTree(machines = []) {
  var unnamed = 1;

  return renderJSON(machines.reduce((tree, machine) => {
    var machineName = getMachineName(machine);

    if (machineName === '<unnamed>') machineName = `<unnamed(${ ++unnamed })>`;
    tree[machineName] = machine.state;
    return tree;
  }, {}), 'Machines');
};

export function renderStateAsTree(state = {}) {
  return renderJSON(state, 'State');
};

export function renderActionAsTree({
  source,
  time,
  state,
  origin,
  index,
  uid,
  label,
  icon,
  ...rest
} = {}, actions) {
  if (typeof source === 'undefined') return null;

  const diff = time - actions[0].time;

  return renderJSON({
    time: '+' + formatMilliseconds(diff),
    ...rest
  }, 'Event');
};
