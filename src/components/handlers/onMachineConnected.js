/* eslint-disable no-unused-vars */
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

export default function onMachineConnected({ state, meta }) {
  const machinesConnectedTo = state.map(getMachineName).join(', ');
  const component = meta.component ? <strong>{ `<${ meta.component }>` }</strong> : null;

  return [
    (
      <div>
        <i className='fa fa-link'></i>
        { component } connected to <strong>{ machinesConnectedTo }</strong>
      </div>
    ),
    `${ meta.component ? meta.component : '' } connected to ${ machinesConnectedTo }`
  ];
}
