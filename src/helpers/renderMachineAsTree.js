import getMachineName from './getMachineName';
import renderJSON from './renderJSON';

export default function renderMachinesAsTree(machines = []) {
  var unnamed = 1;

  return renderJSON(machines.reduce((tree, machine) => {
    var machineName = getMachineName(machine);

    if (machineName === '<unnamed>') machineName = `<unnamed(${ ++unnamed })>`;
    tree[machineName] = machine.state;
    return tree;
  }, {}), 'Machines');
};
