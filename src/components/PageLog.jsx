import React from 'react';
import getMachineName from '../helpers/getMachineName';
import { connect } from 'stent/lib/react';
import JSONTree from 'react-json-tree';
import formatMilliseconds from '../helpers/formatMilliseconds';
import treeTheme from '../helpers/treeTheme';
import { Machine } from 'stent';

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

const nav = Machine.create('Nav', {
  state: { name: 'state' }, 
  transitions: {
    'state': {
      'view action': 'action',
      'view machines': 'machines'
    },
    'action': {
      'view state': 'state',
      'view machines': 'machines'
    },
    'machines': {
      'view state': 'state',
      'view action': 'action'
    }
  } 
});

class PageLog extends React.Component {
  constructor(props) {
    super(props);

    this._renderAction = this._renderAction.bind(this);
    this.state = {
      filterByType: null,
      filter: null,
      snapshotIndex: null
    }
  }
  componentDidUpdate() {
    if (this.state.snapshotIndex === null) {
      this.log.scrollTop = this.log.scrollHeight;
    }
  }
  get snapshotIndex() {
    const { snapshotIndex } = this.state;
    const { actions } = this.props;

    return snapshotIndex === null ? actions.length - 1 : snapshotIndex;
  }
  _setSnapshotIndex(index) {
    this.setState({ snapshotIndex: index === this.props.actions.length-1 ? null : index });
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
    const { filterByType, filter, snapshotIndex } = this.state;

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
        className={ action.type + ' actionRow relative' }
        onClick={ () => this._setSnapshotIndex(action.index) } >
        { actionRepresentation[0] }
        { this.snapshotIndex === action.index && <i className='fa fa-thumb-tack snapshotMarker'></i> }
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
    const { actions } = this.props;
    const snapshotAction = actions[this.snapshotIndex];

    if (!snapshotAction) return null;

    return <JSONTree
      data={ renderMachinesAsTree(snapshotAction.machines) }
      theme={ treeTheme }
      getItemString={ getItemString }
    />;
  }
  render() {
    const { clear, navViewState, navViewAction, navViewMachines, navState } = this.props;

    return (
      <div className='pageLog'>
        <div className='logLeft'>
          <div className='logNav'>
            { this.props.actions.length > 0 ? [
              <a onClick={ () => clear() } key='clear' className='ml1 try2'>
                <i className='fa fa-ban'></i> clear
              </a>,
              this._renderFilterSelector(),
              this._renderFilter()
            ] : null }
          </div>
          <ul className='log' ref={ el => (this.log = el) }>
            { this._renderActions() }
          </ul>
        </div>
        <div className='logRight'>
          <div className='logNav fullHeight'>
            <a onClick={ navViewState } className={ navState === 'state' ? 'selected' : null }>State</a>
            <a onClick={ navViewAction } className={ navState === 'action' ? 'selected' : null }>Action</a>
            <a onClick={ navViewMachines } className={ navState === 'machines' ? 'selected' : null }>Machines</a>
          </div>
          <div className='logTree'>
            { navState === 'state' ? this._renderTree() : null }
          </div>
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

export default connect(
  connect(PageLog)
    .with('DevTools')
    .map(({ flushActions }) => ({
      clear: () => flushActions()
    }))
).with('Nav').map(n => {
  return {
    navViewState: n.viewState,
    navViewAction: n.viewAction,
    navViewMachines: n.viewMachines,
    navState: n.state.name
  }
});