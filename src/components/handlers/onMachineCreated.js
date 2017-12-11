// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function onMachineCreated({ event, timeDiff }) {
  const { machine } = event;
  const style = calculateRowStyles(event, { color: 'rgb(200, 212, 201)' });

  return (
    <div style={ style }>
      <TimeDiff timeDiff={ timeDiff } />
      <div className='actionRowContent'>
        <i className='fa fa-plus'></i>
        <strong>{ getMachineName(machine) }</strong> machine created
      </div>
    </div>
  );
};
