// eslint-disable-next-line no-unused-vars
import React from 'react';

export default function UnrecognizedEvent(action) {
  const icon = action.icon || 'fa-angle-double-right';

  return (
    <div>
      <i className={ 'fa ' + icon }></i>
      <strong>{ action.label || 'unrecognized event' }</strong>
    </div>
  );
};
