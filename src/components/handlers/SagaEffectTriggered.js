// eslint-disable-next-line no-unused-vars
import React from 'react';
import readFromPath from '../../helpers/readFromPath';
import isDefined from '../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectIds from './helpers/SagaEffectIds';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function SagaEffectTriggered({ event }) {
  var label = '';
  const { effect, timeDiff } = event;
  const style = calculateRowStyles(event, { color: '#c8ead6' });

  if (isDefined(effect)) {
    const saga = readFromPath(effect, 'saga.__func');

    if (readFromPath(effect, 'root') === true) {
      label = <span>Root saga { saga ? <strong>({ saga })</strong> : ''}</span>;
    } else {
      label = (
        <span>
          <SagaEffectName effect={ effect } />
        </span>
      );
    }
  }

  return (
    <div style={ style }>
      <TimeDiff timeDiff={ timeDiff } />
      <div className='actionRowContent'>
        <i className='fa fa-square-o'></i>
        <SagaEffectIds event={ event } />
        { label }
      </div>
    </div>
  );
}
