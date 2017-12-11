// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
import renderJSONPreview from '../../helpers/renderJSONPreview';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function ReduxAction({ event }) {
  var label = '';
  const { action, timeDiff } = event;
  const style = calculateRowStyles(event, { color: '#c8ecf1' });

  if (isDefined(action)) {
    const { type, ...rest } = action;

    label = (
      <span>
        <strong>{ type }</strong> <small>{ renderJSONPreview(rest) }</small>
      </span>
    );
  }

  return (
    <div style={ style }>
      <TimeDiff timeDiff={ timeDiff } />
      <div className='actionRowContent'>
        <i className='fa fa-dot-circle-o'></i>
        { label }
      </div>
    </div>
  );
}
