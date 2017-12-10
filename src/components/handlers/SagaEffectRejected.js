// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../helpers/isDefined';
import readFromPath from '../../helpers/readFromPath';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
// eslint-disable-next-line no-unused-vars
import SagaEffectIds from './helpers/SagaEffectIds';

export default function SagaEffectCanceled(event) {
  var label = 'canceled';
  const { error } = event;

  if (isDefined(error)) {
    const message = readFromPath(error, 'message', false);

    if (message) {
      label = <strong>{ message }</strong>;
    } else {
      label = 'error';
    }
  }

  return (
    <div>
      <i className='fa fa-frown-o'></i>
      <SagaEffectIds event={ event } />
      { label }
    </div>
  );
}
