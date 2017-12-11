// eslint-disable-next-line no-unused-vars
import React from 'react';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function UnrecognizedEvent({ event }) {
  const icon = event.icon || 'fa-angle-double-right';
  const label = event.label && event.label.replace(/ /g, '') !== event.type ?
    <div style={{ marginLeft: '1.6em' }}>{ event.label }</div> : '';
  const style = calculateRowStyles(event, { color: '#e6e6e6' });

  return (
    <div style={ style }>
      <TimeDiff timeDiff={ event.timeDiff } />
      <div className='actionRowContent'>
        <i className={ 'fa ' + icon } style={{ marginRight: '0.5em' }}></i>
        <strong>{ event.type }</strong>
        { label }
      </div>
    </div>
  );
};
