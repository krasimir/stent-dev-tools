// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function SagaEffectActionDispatched({ event }) {
  var label = '';
  const { action, timeDiff } = event;
  const style = calculateRowStyles(event, { color: '#c8ead6' });

  if (isDefined(action)) {
    label = <span>Action <strong>{ action.type }</strong> dispatched</span>;
  }

  return (
    <div style={ style }>
      <TimeDiff timeDiff={ timeDiff } />
      <div className='actionRowContent'>
        <i className='fa fa-toggle-right'></i>
        { label }
      </div>
    </div>
  );
}
