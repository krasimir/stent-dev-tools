/* eslint-disable no-unused-vars */

import React from 'react';
import formatMilliseconds from '../helpers/formatMilliseconds';

export default function TimeDiff({ diff }) {
  return (
    <small className='right mr1'>
      <i className='fa fa-clock-o' style={{ marginRight: '0.5em' }}></i>
      +{ formatMilliseconds(diff) }
    </small>
  );
}
