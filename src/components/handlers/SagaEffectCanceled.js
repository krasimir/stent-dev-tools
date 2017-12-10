// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
// eslint-disable-next-line no-unused-vars
import SagaEffectIds from './helpers/SagaEffectIds';

export default function SagaEffectCanceled(event) {
  var label = 'canceled';

  return (
    <div>
      <i className='fa fa-times-rectangle-o'></i>
      <SagaEffectIds event={ event } />
      { label }
    </div>
  );
}
