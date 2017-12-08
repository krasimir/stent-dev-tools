// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

export default function onActionDispatched({ actionName, machine, args }) {
  return (
    <div>
      <i className='fa fa-share'></i>
      <strong>{ actionName }</strong>
      <i className='fa fa-long-arrow-right' style={{ marginRight: '0.5em', marginLeft: '0.5em' }}></i>
      <strong>{ getMachineName(machine) }</strong>
    </div>
  );
}
