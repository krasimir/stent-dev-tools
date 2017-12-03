import React from 'react';
import getMachineName from '../helpers/getMachineName';
import { connect } from 'stent/lib/react';
import JSONTree from 'react-json-tree';
import formatMilliseconds from '../helpers/formatMilliseconds';

const treeTheme = {
  scheme: 'chalk',
  author: 'chris kempson (http://chriskempson.com)',
  base00: '#151515',
  base01: '#202020',
  base02: '#303030',
  base03: '#505050',
  base04: '#b0b0b0',
  base05: '#d0d0d0',
  base06: '#e0e0e0',
  base07: '#f5f5f5',
  base08: '#fb9fb1',
  base09: '#eda987',
  base0A: '#ddb26f',
  base0B: '#acc267',
  base0C: '#12cfc0',
  base0D: '#6fc2ef',
  base0E: '#e1a3ee',
  base0F: '#deaf8f'
};
const getItemString = (type, data, itemType, itemString) => {
  if (type === 'Array') return <span>// ({ itemString })</span>;
  return null;
};
function renderMachinesAsTree(machines) {
  var unnamed = 1;
  return machines.reduce((tree, machine) => {
    var machineName = getMachineName(machine);

    if (machineName === '<unnamed>') machineName = `<unnamed(${ ++unnamed })>`
    tree[machineName] = machine.state;
    return tree;
  }, {})
}

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
    // this.logWrapper.scrollTop = this.logWrapper.scrollHeight;
  }
  _getSnapshotIndex() {
    const { actions, snapshotIndex } = this.props;
    return snapshotIndex !== null ? snapshotIndex : actions.length - 1;
  }
  _onFilterTypeChanged(filter) {
    this.setState({ filterByType: filter === 'all' ? null : filter });
  }
  _onFilterChange(filter) {
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
  _renderAction(action) {
    const { filterByType, filter } = this.state;
    const { snapshotIndex } = this.props;

    if (!this[action.type]) {
      return null;
    }
    if (filterByType !== null && action.type !== filterByType) return null;

    const actionRepresentation = this[action.type](action);

    if (filter !== null && !actionRepresentation[1].toLowerCase().match(new RegExp(filter, 'ig'))) {
      return null;
    }

    return (
      <li
        key={ action.index }
        className={ action.type + ' ' + 'actionRow' }
        onClick={ () => this.props.changeCurrentSnapshot(action.index) } >
        { actionRepresentation[0] }
        { snapshotIndex === action.index && <i className='fa fa-ban right'></i> }
      </li>
    );
  }
  _renderActions() {
    return this.props.actions.map(this._renderAction);
    // const actionsByTime = this.props.actions.reduce((result, action) => {
    //   if (!result[action.time]) result[action.time] = [];
    //   result[action.time].push(action);
    //   return result;
    // }, {});
    // let actions = Object.keys(actionsByTime).map(time => ({
    //   time,
    //   actions: actionsByTime[time]
    // }));

    // actions = actions.sort((a, b) => a.time - b.time);

    // return actions.map(({ time, actions }) => {
    //   return [this._renderTimeSplit(time)].concat(actions.map(this._renderAction));
    // });
  }
  _renderTree() {
    const snapshotAction = this.props.actions[this._getSnapshotIndex()];

    if (!snapshotAction) return null;

    return <JSONTree
      data={ renderMachinesAsTree(snapshotAction.machines) }
      theme={ treeTheme }
      getItemString={ getItemString }
    />;
  }
  render() {
    const { clear } = this.props;

    return (
      <div className='pageLog'>
        <div className='logNav'>
          { this.props.actions.length > 0 ? [
            <a onClick={ () => clear() } key='clear'><i className='fa fa-ban'></i> clear</a>,
            this._renderFilterSelector(),
            this._renderFilter()
          ] : null }
        </div>
        <div className='logWrapper' ref={ el => (this.logWrapper = el) }>
          <ul className='log'>
            { this._renderActions() }
          </ul>
        </div>
        <div className='logTree'>
          { this._renderTree() }
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
  .map(({ flushActions, state, snapshot }) => ({
    clear: () => flushActions(),
    changeCurrentSnapshot: index => snapshot(index),
    snapshotIndex: state.snapshotIndex
  }));