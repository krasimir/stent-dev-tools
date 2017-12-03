import React from 'react';
import getMachineName from '../helpers/getMachineName';
import { connect } from 'stent/lib/react';

class PageLog extends React.Component {
  constructor(props) {
    super(props);

    this._renderAction = this._renderAction.bind(this);
    this.state = {
      filterByType: null,
      filter: null
    }
  }
  componentDidUpdate() {
    this.logWrapper.scrollTop = this.logWrapper.scrollHeight;
  }
  _onFilterTypeChanged(filter) {
    this.setState({ filterByType: filter === 'all' ? null : filter });
  }
  _onFilterChange(filter) {
    console.log(filter);
    this.setState({ filter: filter === '' ? null : filter });
  }
  _renderTimeSplit(time) {
    if (this.props.actions.length === 0) return null;

    const diff = time - this.props.actions[0].time;

    return <div className='timeSplit'><a>+ { formatMilliseconds(diff) }</a></div>;
  }
  _renderFilterSelector() {
    const options = this.props.actions.reduce((result, action) => {
      if (!result.find(o => o === action.type)) result.push(action.type);
      return result;
    }, ['all']);

    return (
      <select onChange={ e => this._onFilterTypeChanged(e.target.value) } className='left' key='filter1'>
        { options.map((type, i) => <option value={ type } key={ i }>{ type }</option>) }
      </select>
    )
  }
  _renderFilter() {
    return (
      <input
        type='text'
        className='filter left'
        placeholder='filter'
        key='filter2'
        onChange={ event => this._onFilterChange(event.target.value) } />
    );
  }
  _renderAction(action, i) {
    const { filterByType, filter } = this.state;

    if (!this[action.type]) {
      // console.warn(`I can't render ${ action.type } type of action`);
      return null;
    }
    if (filterByType !== null && action.type !== filterByType) return null;

    const actionRepresentation = this[action.type](action);

    if (filter !== null && !actionRepresentation[1].toLowerCase().match(new RegExp(filter, 'ig'))) {
      return null;
    }

    return <li key={ i } className={ action.type }>{ actionRepresentation[0] }</li>;
  }
  _renderActions() {
    const actionsByTime = this.props.actions.reduce((result, action) => {
      if (!result[action.time]) result[action.time] = [];
      result[action.time].push(action);
      return result;
    }, {});
    let actions = Object.keys(actionsByTime).map(time => ({
      time,
      actions: actionsByTime[time]
    }));

    actions = actions.sort((a, b) => a.time - b.time);

    return actions.map(({ time, actions }) => {
      return [this._renderTimeSplit(time)].concat(actions.map(this._renderAction));
    });
  }
  render() {
    return (
      <div>
        <div className='logNav'>
          { this.props.actions.length > 0 ? [
            <a onClick={ () => this.props.clear() } key='clear'><i className='fa fa-ban'></i> clear</a>,
            this._renderFilterSelector(),
            this._renderFilter()
          ] : null }
        </div>
        <div className='logWrapper' ref={ el => (this.logWrapper = el) }>
          <ul className='log'>
            { this._renderActions() }
          </ul>
        </div>
      </div>
    )
  }
  onMachineCreated({ machine }) {
    return [
      (
        <div>
          <i className='fa fa-plus'></i>
          <strong>{ getMachineName(machine) }</strong> machine created
        </div>
      ),
      `${ getMachineName(machine) } machine created`
    ];
  }
  onMachineConnected({ machines, meta }) {
    const machinesConnectedTo = machines.map(getMachineName).join(', ');
    const component = meta.component ? <strong>{ `<${ meta.component }>` }</strong> : null;

    return [
      (
        <div>
          <i className='fa fa-link'></i>
          { component } connected to <strong>{ machinesConnectedTo }</strong>
        </div>
      ),
      `${ meta.component ? meta.component : '' } connected to ${ machinesConnectedTo }`
    ]
  }
  onActionDispatched({ actionName, machine, args }) {
    return [
      (
        <div>
          <i className='fa fa-arrow-right'></i>
          <strong>{ actionName }</strong> dispatched to <strong>{ getMachineName(machine) }</strong>
        </div>
      ),
      `${ actionName } dispatched to ${ getMachineName(machine) }`
    ]
  }
  onGeneratorStep({ yielded }) {
    var message = '';
    var messageNoTags = '';

    if (typeof yielded === 'string') {
      message = <span>transition to <strong>&#123; name: { yielded } }</strong></span>;
      messageNoTags = `transition to ${ yielded }`;
    } else if (typeof yielded === 'object') {
      if (yielded.__type === 'call') {
        message = <span>please call <strong>{ yielded.func }</strong> with ...</span>;
        messageNoTags = `please call ${ yielded.func } with ...`
      } else if (yielded.name) {
        message = <span>transition to <strong>&#123; name: { yielded.name }, ...}</strong></span>;
        messageNoTags = `transition to ${ yielded.name }`;
      }
    }
    return [
      (
        <div>
          <i className='fa fa-spinner'></i>
          { message }
        </div>
      ),
      messageNoTags
    ];
  }
  // onStateWillChange() {}
  onStateChanged({ machine }) {
    return [
      (
        <div>
          <i className='fa fa-arrow-right'></i>
          <strong>{ getMachineName(machine) }</strong>'s state changed to <strong>{ machine.state.name }</strong>
        </div>
      ),
      `${ getMachineName(machine) }'s state changed to ${ machine.state.name }`
    ]
  }
  onMachineDisconnected({ machines, meta }) {
    const machinesConnectedTo = machines.map(getMachineName).join(', ');
    const component = meta.component ? <strong>{ `<${ meta.component }>` }</strong> : null;

    return [
      (
        <div>
          <i className='fa fa-unlink'></i>
          { component } disconnected from <strong>{ machinesConnectedTo }</strong>
        </div>
      ),
      `${ meta.component ? meta.component : '' } disconnected from ${ machinesConnectedTo }`
    ]
  }
};


export default connect(PageLog)
  .with('DevTools')
  .map(({ flushActions }) => ({ clear: () => flushActions() }));


function formatMilliseconds(millisec) {
  var seconds = (millisec / 1000).toFixed(0);
  var minutes = Math.floor(seconds / 60);
  var hours = '';
  var ms = Math.floor(millisec % 1000);
  if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      hours = (hours >= 10) ? hours : "0" + hours;
      minutes = minutes - (hours * 60);
      minutes = (minutes >= 10) ? minutes : "0" + minutes;
  }
  if (ms < 100) {
    if (ms < 10) { ms = '00' + ms; }
    else { ms = '0' + ms };
  }

  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  if (hours !== "") {
      return hours + ":" + minutes + ":" + seconds + ':' + ms;
  }
  return minutes + ":" + seconds + ':' + ms;
}