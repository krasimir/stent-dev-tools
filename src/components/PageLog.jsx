import React from 'react';

const getMachineName = ({ name }) => {
  if (name.indexOf('_@@@') === 0) {
    return '<unnamed>';
  }
  return name;
}

export default class PageLog extends React.Component {
  onMachineCreated({ machine }, idx) {
    return (
      <div>
        <i className='fa fa-plus'></i>
        <strong>{ getMachineName(machine) }</strong> machine created
      </div>
    );
  }
  onMachineConnected({ machines, meta }) {
    const machinesConnectedTo = machines.map(getMachineName).join(', ');
    const component = meta.component ? <strong>{ `<${ meta.component }>` }</strong> : null;

    return (
      <div>
        <i className='fa fa-link'></i>
        { component } connected to <strong>{ machinesConnectedTo }</strong>
      </div>
    );
  }
  onActionDispatched({ actionName, machine, args }) {
    return (
      <div>
        <i className='fa fa-arrow-right'></i>
        <strong>{ actionName }</strong> dispatched to <strong>{ getMachineName(machine) }</strong>
      </div>
    );
  }
  onGeneratorStep({ yielded }) {
    var message = '';

    if (typeof yielded === 'string') {
      message = <span>my new state is <strong>&#123; name: { yielded } }</strong></span>;
    } else if (typeof yielded === 'object') {
      if (yielded.__type === 'call') {
        message = <span>please call <strong>{ yielded.func }</strong> with ...</span>;
      } else if (yielded.name) {
        message = <span>my new state is <strong>&#123; name: { yielded.name }, ...}</strong></span>;
      }
    }
    return (
      <div>
        <i className='fa fa-bullhorn'></i>
        { message }
      </div>
    );
  }
  onStateWillChange() {
    return 'onStateWillChange';
  }
  onStateChanged() {
    return 'onStateChanged';
  }
  render() {
    return (
      <ul className='log'>
        { this.props.actions.map((action, i) => {
          return this[action.type] ?
            <li key={ i } className={ action.type }>{ this[action.type](action) }</li> :
            null;
        })}
      </ul>
    )
  }
}