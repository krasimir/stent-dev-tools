/* eslint-disable no-unused-vars */
import React from 'react';

export default function UnrecognizedAction(action) {
  const icon = action.icon || 'fa-angle-double-right';

  return [
    (
      <div>
        <i className={ 'fa ' + icon }></i>
        <strong>{ action.label || 'unrecognized event' }</strong>
      </div>
    ),
    'bla bla'
  ];
};
