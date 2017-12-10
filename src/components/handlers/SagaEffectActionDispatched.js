// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';

export default function SagaEffectActionDispatched(event) {
  var label = '';
  const { action } = event;

  if (isDefined(action)) {
    label = <span>Action <strong>{ action.type }</strong> dispatched</span>;
  }

  return (
    <div>
      <i className='fa fa-toggle-right'></i>
      { label }
    </div>
  );
}
