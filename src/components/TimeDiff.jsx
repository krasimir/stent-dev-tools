// eslint-disable-next-line no-unused-vars
import React from 'react';

export default function TimeDiff({ timeDiff }) {
  if (!timeDiff) return null;
  return (
    <small className='right mr1'>
      <i className='fa fa-clock-o' style={{ marginRight: '0.5em' }}></i>
      { timeDiff }
    </small>
  );
}
