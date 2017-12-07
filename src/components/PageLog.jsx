import React from 'react';
import { connect } from 'stent/lib/react';
import formatMilliseconds from '../helpers/formatMilliseconds';
import renderMachinesAsTree from '../helpers/renderMachineAsTree';
import renderActionAsTree from '../helpers/renderActionAsTree';
import onMachineCreated from './handlers/onMachineCreated';
import onMachineConnected from './handlers/onMachineConnected';
import onMachineDisconnected from './handlers/onMachineDisconnected';
import onActionDispatched from './handlers/onActionDispatched';
import onActionProcessed from './handlers/onActionProcessed';
import onGeneratorStep from './handlers/onGeneratorStep';
import onGeneratorEnd from './handlers/onGeneratorEnd';
import onGeneratorResumed from './handlers/onGeneratorResumed';
import onStateChanged from './handlers/onStateChanged';

const handlers = {
  onMachineCreated,
  onMachineConnected,
  onMachineDisconnected,
  onActionDispatched,
  onActionProcessed,
  onGeneratorStep,
  onGeneratorEnd,
  onGeneratorResumed,
  onStateChanged
};

class PageLog extends React.Component {
  constructor(props) {
    super(props);

    this._renderAction = this._renderAction.bind(this);
    this.state = {
      filterByType: null,
      filter: null,
      frame: null,
      snapshotIndex: null
    };
  }
  componentDidUpdate() {
    if (this.state.snapshotIndex === null) {
      this.log.scrollTop = this.log.scrollHeight;
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.actions.length === 1) {
      this.setState({ frame: newProps.actions[0].uid });
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
  _onFrameChange(frame) {
    this.setState({ frame });
  }
  _renderTimeSplit(time) {
    if (this.props.actions.length === 0) return null;

    const diff = time - this.props.actions[0].time;

    return <div className='timeSplit'><a>+ { formatMilliseconds(diff) }</a></div>;
  }
  _renderFilterSelector() {
    const options = this.props.actions.reduce((result, action) => {
      if (!result.find(o => o === action.type) && this[action.type]) result.push(action.type);
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
        style={{ width: '50px' }}
        type='text'
        className='filter left'
        placeholder='filter'
        key='filter2'
        onChange={ event => this._onFilterChange(event.target.value) } />
    );
  }
  _renderFrameSelector() {
    const options = this.props.actions.reduce((result, action) => {
      if (!result.find(o => o === action.uid)) result.push(action.uid);
      return result;
    }, []);

    return (
      <select onChange={ e => this._onFrameChange(e.target.value) } className='left mr1' key='filter3'>
        { options.map((uid, i) => <option value={ uid } key={ i }>{ `<frame ${ i + 1 }>` }</option>) }
      </select>
    );
  }
  _renderAction(action) {
    const { filterByType, filter, frame } = this.state;
    var filteredOut = false;

    // no render method to handle it
    if (!handlers[action.type]) return null;
    // filter by type
    if (filterByType !== null && action.type !== filterByType) filteredOut = true;
    // filter by frame
    if (action.uid !== frame) return null;

    const actionRepresentation = handlers[action.type](action);

    // filter by text
    if (filter !== null && !actionRepresentation[1].toLowerCase().match(new RegExp(filter, 'ig'))) {
      filteredOut = true;
    }

    return (
      <li
        key={ action.index }
        className={ action.type + ' actionRow relative ' + (filteredOut ? 'filteredOut' : '') }
        onClick={ () => this._setSnapshotIndex(action.index) } >
        { actionRepresentation[0] }
        { this.snapshotIndex === action.index && <i className='fa fa-thumb-tack snapshotMarker'></i> }
      </li>
    );
  }
  _renderState() {
    const { actions } = this.props;
    const snapshotAction = actions[this.snapshotIndex];

    if (!snapshotAction) return null;
    return renderMachinesAsTree(snapshotAction.machines);
  }
  render() {
    const { clear, navViewState, navViewEvent, navViewAnalysis, navState, actions } = this.props;

    return (
      <div className='pageLog'>
        <div className='logLeft'>
          <div className='logNav'>
            { this.props.actions.length > 0 ? [
              <a onClick={ () => clear() } key='clear' className='right mr1 try2'>
                <i className='fa fa-ban'></i> clear
              </a>,
              this._renderFrameSelector(),
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
            <a onClick={ navViewEvent } className={ navState === 'event' ? 'selected' : null }>
              <i className='fa fa-dot-circle-o mr05'></i>Event</a>
            <a onClick={ navViewAnalysis } className={ navState === 'analysis' ? 'selected' : null }>
              <i className='fa fa-bar-chart-o mr05'></i>Analysis</a>
          </div>
          <div className='logTree'>
            { navState === 'state' ? this._renderState() : null }
            { navState === 'event' ? renderActionAsTree(actions[this.snapshotIndex], actions) : null }
            { navState === 'analysis' ? 'Work in progress ...' : null }
          </div>
        </div>
      </div>
    );
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
    navViewEvent: n.viewEvent,
    navViewAnalysis: n.viewAnalysis,
    navState: n.state.name
  };
});
