import React from 'react';

const getMachineName = ({ name }) => {
  if (name.indexOf('_@@@') === 0) {
    return '<unnamed>';
  }
  return name;
}

export default class PageLog extends React.Component {
  constructor(props) {
    super(props);

    this._renderAction = this._renderAction.bind(this);
    this.state = {
      filter: null
    }
  }
  componentDidUpdate() {
    this.logWrapper.scrollTop = this.logWrapper.scrollHeight;
  }
  _onFilterChanged(filter) {
    this.setState({ filter: filter === 'all' ? null : filter });
  }
  _renderFilterSelector() {
    const options = this.props.actions.reduce((result, action) => {
      if (!result.find(o => o === action.type)) result.push(action.type);
      return result;
    }, ['all']);

    return (
      <select onChange={ e => this._onFilterChanged(e.target.value) }>
        { options.map((type, i) => <option value={ type } key={ i }>{ type }</option>) }
      </select>
    )
  }
  _renderAction(action, i) {
    const { filter } = this.state;

    if (!this[action.type]) return null;
    if (filter !== null && action.type !== filter) return null;

    return <li key={ i } className={ action.type }>{ this[action.type](action) }</li>;
  }
  render() {
    return (
      <div>
        <div className='logNav'>
          { this._renderFilterSelector() }
        </div>
        <div className='logWrapper' ref={ el => (this.logWrapper = el) }>
          <ul className='log'>
            { this.props.actions.map(this._renderAction) }
          </ul>
        </div>
      </div>
    )
  }
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
      message = <span>transition to <strong>&#123; name: { yielded } }</strong></span>;
    } else if (typeof yielded === 'object') {
      if (yielded.__type === 'call') {
        message = <span>please call <strong>{ yielded.func }</strong> with ...</span>;
      } else if (yielded.name) {
        message = <span>transition to <strong>&#123; name: { yielded.name }, ...}</strong></span>;
      }
    }
    return (
      <div>
        <i className='fa fa-spinner'></i>
        { message }
      </div>
    );
  }
  // onStateWillChange() {}
  onStateChanged({ machine }) {
    return (
      <div>
        <i className='fa fa-arrow-right'></i>
        <strong>{ getMachineName(machine) }</strong>'s state changed to <strong>{ machine.state.name }</strong>
      </div>
    );
  }
  onMachineDisconnected({ machines, meta }) {
    const machinesConnectedTo = machines.map(getMachineName).join(', ');
    const component = meta.component ? <strong>{ `<${ meta.component }>` }</strong> : null;

    return (
      <div>
        <i className='fa fa-unlink'></i>
        { component } disconnected from <strong>{ machinesConnectedTo }</strong>
      </div>
    );
  }
}