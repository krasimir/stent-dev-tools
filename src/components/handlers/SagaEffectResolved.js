// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectIds from './helpers/SagaEffectIds';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
import renderJSONPreview from '../../helpers/renderJSONPreview';

const getResultRepresentation = function (result, i) {
  if (isDefined(result) && result !== null) {
    if (typeof result === 'object') {
      if ('@@redux-saga/TASK' in result) {
        return <strong key={ i }>{ result.name }&nbsp;</strong>;
      }
      return renderJSONPreview(result);
    }
    return result;
  }
  return null;
};

export default function SagaEffectResolved(event) {
  var label = '';
  const { result } = event;

  if (isDefined(result)) {
    if (typeof result === 'object' && result !== null) {
      if ('@@redux-saga/TASK' in result) {
        label = getResultRepresentation(result);
      } else if ('type' in result) {
        label = result.type;
      } else if (Array.isArray(result)) {
        if (typeof result[0] === 'object' && '@@redux-saga/TASK' in result[0]) {
          label = result.map(getResultRepresentation);
        } else {
          label = renderJSONPreview(result);
        }
      } else {
        label = renderJSONPreview(result);
      }
    } else if (result !== null) {
      label = result;
    }
  }

  return (
    <div>
      <i className='fa fa-check-square-o'></i>
      <SagaEffectIds event={ event } />
      { label }
    </div>
  );
}
