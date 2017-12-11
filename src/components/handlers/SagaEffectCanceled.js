// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
// eslint-disable-next-line no-unused-vars
import SagaEffectIds from './helpers/SagaEffectIds';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function SagaEffectCanceled({ event }) {
  var label = 'canceled';
  const style = calculateRowStyles(event, { color: '#c8ead6' });
  const { timeDiff } = event;

  return (
    <div style={ style }>
      <TimeDiff timeDiff={ timeDiff } />
      <div className='actionRowContent'>
        <i className='fa fa-times-rectangle-o'></i>
        <SagaEffectIds event={ event } />
        { label }
      </div>
    </div>
  );
}
