/* eslint-disable no-unused-vars */
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

export default function onStateChanged({ machine }) {
  return [
    (
      <div>
        <i className='fa fa-heart'></i>
        <strong>{ getMachineName(machine) }</strong>'s state changed to <strong>{ machine.state.name }</strong>
      </div>
    ),
    `${ getMachineName(machine) }'s state changed to ${ machine.state.name }`
  ];
}
