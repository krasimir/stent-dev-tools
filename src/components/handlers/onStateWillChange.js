// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function onStateWillChange({ event }) {
  const { machine, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(201, 172, 186)' });

  return (
    <div style={ style }>
      <TimeDiff timeDiff={ timeDiff } />
      <div className='actionRowContent'>
        <i className='fa fa-heart'></i>
        <strong>{ getMachineName(machine) }</strong>'s state(<strong>{ machine.state.name }</strong>) will change
      </div>
    </div>
  );
}
