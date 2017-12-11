// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../helpers/getMachineName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function onMachineConnected({ event, onClick, className }) {
  const { state, meta, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(170, 189, 207)' });
  const machinesConnectedTo = state.map(getMachineName).join(', ');
  const component = meta.component ? <strong>{ `<${ meta.component }>` }</strong> : null;

  return (
    <li style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-link'></i>
        { component } connected to <strong>{ machinesConnectedTo }</strong>
      </div>
    </li>
  );
}
