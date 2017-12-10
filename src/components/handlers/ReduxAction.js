// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
import renderJSONPreview from '../../helpers/renderJSONPreview';

export default function ReduxAction(event) {
  var label = '';
  const { action } = event;

  if (isDefined(action)) {
    const { type, ...rest } = action;

    label = (
      <span>
        <strong>{ type }</strong> <small>{ renderJSONPreview(rest) }</small>
      </span>
    );
  }

  return (
    <div>
      <i className='fa fa-dot-circle-o'></i>
      { label }
    </div>
  );
}
