// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import getMachineName from '../../helpers/getMachineName';
import shortenJSON from '../../helpers/shortenJSON';

export default function onGeneratorResumed({ value }) {
  const short = value ? `with ${ shortenJSON(value) }` : '';

  return (
    <div>
      <i className='fa fa-arrow-circle-right'></i>
      generator <strong>resumed</strong> { short }
    </div>
  );
}
