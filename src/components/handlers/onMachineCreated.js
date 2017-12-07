/* eslint-disable no-unused-vars */
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

export default function onMachineCreated({ machine }) {
  return [
    (
      <div>
        <i className='fa fa-plus'></i>
        <strong>{ getMachineName(machine) }</strong> machine created
      </div>
    ),
    `${ getMachineName(machine) } machine created`
  ];
};
