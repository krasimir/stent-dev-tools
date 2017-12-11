// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function onMachineDisconnected({ event }) {
  const { state, meta, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(170, 189, 207)' });
  const machinesConnectedTo = state.map(getMachineName).join(', ');
  const component = meta.component ? <strong>{ `<${ meta.component }>` }</strong> : null;

  return (
    <div style={ style }>
      <TimeDiff timeDiff={ timeDiff } />
      <div className='actionRowContent'>
        <i className='fa fa-unlink'></i>
        { component } disconnected from <strong>{ machinesConnectedTo }</strong>
      </div>
    </div>
  );
}
