// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

export default function onStateWillChange({ machine }) {
  return (
    <div>
      <i className='fa fa-heart'></i>
      <strong>{ getMachineName(machine) }</strong>'s state(<strong>{ machine.state.name }</strong>) will change
    </div>
  );
}
