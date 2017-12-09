// eslint-disable-next-line no-unused-vars
import React from 'react';

export default function UnrecognizedEvent(action) {
  const icon = action.icon || 'fa-angle-double-right';
  const label = action.label && action.label.replace(/ /g, '') !== action.type ?
    <div style={{ marginLeft: '1.6em' }}>{ action.label }</div> : '';

  return (
    <div>
      <i className={ 'fa ' + icon } style={{ marginRight: '0.5em' }}></i>
      <strong>{ action.type }</strong>
      { label }
    </div>
  );
};
