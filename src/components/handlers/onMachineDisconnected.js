/* eslint-disable no-unused-vars */
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

export default function onMachineDisconnected({ machines, meta }) {
  const machinesConnectedTo = machines.map(getMachineName).join(', ');
  const component = meta.component ? <strong>{ `<${ meta.component }>` }</strong> : null;

  return [
    (
      <div>
        <i className='fa fa-unlink'></i>
        { component } disconnected from <strong>{ machinesConnectedTo }</strong>
      </div>
    ),
    `${ meta.component ? meta.component : '' } disconnected from ${ machinesConnectedTo }`
  ];
}
