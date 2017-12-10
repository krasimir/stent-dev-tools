// eslint-disable-next-line no-unused-vars
import React from 'react';
import readFromPath from '../../helpers/readFromPath';
import isDefined from '../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectIds from './helpers/SagaEffectIds';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';

export default function SagaEffectTriggered(event) {
  var label = '';
  const { effect } = event;

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
    <div>
      <i className='fa fa-square-o'></i>
      <SagaEffectIds event={ event } />

      { label }
    </div>
  );
}
