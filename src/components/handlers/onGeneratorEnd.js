// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import getMachineName from '../../helpers/getMachineName';
import shortenJSON from '../../helpers/shortenJSON';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function onGeneratorEnd({ event }) {
  const { value, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(201, 202, 189)' });
  const short = value ? `with ${ shortenJSON(value) }` : '';

  return (
    <div style={ style }>
      <TimeDiff timeDiff={ timeDiff } />
      <div className='actionRowContent'>
        <i className='fa fa-check-circle-o'></i>
        generator <strong>completed</strong> { short }
      </div>
    </div>
  );
}
