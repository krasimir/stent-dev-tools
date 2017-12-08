import React from 'react';
import getMachineName from '../../helpers/getMachineName';
import shortenJSON from '../../helpers/shortenJSON';

export default function onGeneratorStep({ yielded }) {
  var message = '';

  if (typeof yielded === 'string') {
    message = <span>generator yielded <strong>&#123; name: { yielded } }</strong></span>;
  } else if (typeof yielded === 'object') {
    if (yielded.__type === 'call') {
      const argsText = yielded.args.length === 0 ? 'with no arguments' : `with ${ shortenJSON(yielded.args) }`;

      message = (
        <span>calling <strong>{ yielded.func }</strong> { argsText }</span>
      );
    } else if (yielded.name) {
      message = <span>generator yielded <strong>&#123; name: { yielded.name }, ...}</strong></span>;
      messageNoTags = `generator yielded ${ yielded.name }`;
    }
  }
  return (
    <div>
      <i className='fa fa-arrow-circle-left'></i>
      { message }
    </div>
  )
};
