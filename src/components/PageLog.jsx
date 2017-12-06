import React from 'react';
import getMachineName from '../helpers/getMachineName';
import { connect } from 'stent/lib/react';
import formatMilliseconds from '../helpers/formatMilliseconds';
import renderJSON from '../helpers/renderJSON';
import shortenJSON from '../helpers/shortenJSON';

const renderMachinesAsTree = function (machines = []) {
  var unnamed = 1;

  return renderJSON(machines.reduce((tree, machine) => {
    var machineName = getMachineName(machine);

    if (machineName === '<unnamed>') machineName = `<unnamed(${ ++unnamed })>`;
    tree[machineName] = machine.state;
    return tree;
  }, {}));
};

const renderActionAsTree = function ({ source, time, machines, origin, index, uid, ...rest } = {}, actions) {
  if (typeof source === 'undefined') return null;

  const diff = time - actions[0].time;

  return renderJSON({
    time: '+' + formatMilliseconds(diff),
    ...rest
  });
};

class PageLog extends React.Component {
  constructor(props) {
    super(props);

    this._renderAction = this._renderAction.bind(this);
    this.state = {
      filterByType: null,
      filter: null,
      snapshotIndex: null
    };
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
    this.setState({ snapshotIndex: index === this.props.actions.length - 1 ? null : index });
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
    );
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
  _renderTree() {
    const { actions } = this.props;
    const snapshotAction = actions[this.snapshotIndex];

    if (!snapshotAction) return null;
    return renderMachinesAsTree(snapshotAction.machines);
  }
  render() {
    const { clear, navViewState, navViewAction, navViewMachines, navState, actions } = this.props;

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
            { actions.map(this._renderAction) }
          </ul>
        </div>
        <div className='logRight'>
          <div className='logNav fullHeight'>
            <a onClick={ navViewState } className={ navState === 'state' ? 'selected' : null }>
              <i className='fa fa-heart-o mr05'></i>State</a>
            <a onClick={ navViewAction } className={ navState === 'action' ? 'selected' : null }>
              <i className='fa fa-arrow-right mr05'></i>Action</a>
            <a onClick={ navViewMachines } className={ navState === 'machines' ? 'selected' : null }>
              <i className='fa fa-gears mr05'></i>Machines</a>
          </div>
          <div className='logTree'>
            { navState === 'state' ? this._renderTree() : null }
            { navState === 'action' ? renderActionAsTree(actions[this.snapshotIndex], actions) : null }
            { navState === 'machines' ? 'Work in progress ...' : null }
          </div>
        </div>
      </div>
    );
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
    ];
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
    ];
  }
  onGeneratorStep({ yielded }) {
    var message = '';
    var messageNoTags = '';

    if (typeof yielded === 'string') {
      message = <span>generator yielded <strong>&#123; name: { yielded } }</strong></span>;
      messageNoTags = `generator yielded to ${ yielded }`;
    } else if (typeof yielded === 'object') {
      if (yielded.__type === 'call') {
        message = (
          <span>calling <strong>{ yielded.func }</strong> with { shortenJSON(yielded.args) }</span>
        );
        messageNoTags = `calling ${ yielded.func }`;
      } else if (yielded.name) {
        message = <span>generator yielded <strong>&#123; name: { yielded.name }, ...}</strong></span>;
        messageNoTags = `generator yielded ${ yielded.name }`;
      }
    }
    return [
      (
        <div>
          <i className='fa fa-arrow-circle-left'></i>
          { message }
        </div>
      ),
      messageNoTags
    ];
  }
  onGeneratorEnd({ value }) {
    const short = value ? `with ${ shortenJSON(value) }` : '';

    return [
      (
        <div>
          <i className='fa fa-check-circle-o'></i>
          generator completed { short }
        </div>
      ),
      `generator completed with ${ short }`
    ];
  }
  onGeneratorResumed({ value }) {
    const short = value ? `with ${ shortenJSON(value) }` : '';

    return [
      (
        <div>
          <i className='fa fa-arrow-circle-right'></i>
          generator resumed { short }
        </div>
      ),
      `generator resumed with ${ short }`
    ];
  }
  onStateChanged({ machine }) {
    return [
      (
        <div>
          <i className='fa fa-arrow-right'></i>
          <strong>{ getMachineName(machine) }</strong>'s state changed to <strong>{ machine.state.name }</strong>
        </div>
      ),
      `${ getMachineName(machine) }'s state changed to ${ machine.state.name }`
    ];
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