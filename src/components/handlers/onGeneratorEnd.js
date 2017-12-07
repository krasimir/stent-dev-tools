/* eslint-disable no-unused-vars */
import React from 'react';
import getMachineName from '../../helpers/getMachineName';
import shortenJSON from '../../helpers/shortenJSON';

export default function onGeneratorEnd({ value }) {
  const short = value ? `with ${ shortenJSON(value) }` : '';

  return [
    (
      <div>
        <i className='fa fa-check-circle-o'></i>
        generator <strong>completed</strong> { short }
      </div>
    ),
    `generator completed with ${ short }`
  ];
}