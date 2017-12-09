/* eslint-disable no-unused-vars */
import getMachineName from './getMachineName';
import renderJSON from './renderJSON';

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

export function renderEventAsTree(idx, actions) {
  const {
    state,
    origin,
    index,
    uid,
    icon,
    withMarker,
    color,
    ...rest
  } = actions[idx] || {};

  return renderJSON({
    ...rest
  }, 'Event');
};
