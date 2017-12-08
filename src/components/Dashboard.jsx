import React from 'react';
import { connect } from 'stent/lib/react';
import { renderMachinesAsTree, renderActionAsTree, renderStateAsTree } from '../helpers/renderAsTree';
import onMachineCreated from './handlers/onMachineCreated';
import onMachineConnected from './handlers/onMachineConnected';
import onMachineDisconnected from './handlers/onMachineDisconnected';
import onActionDispatched from './handlers/onActionDispatched';
import onActionProcessed from './handlers/onActionProcessed';
import onGeneratorStep from './handlers/onGeneratorStep';
import onGeneratorEnd from './handlers/onGeneratorEnd';
import onGeneratorResumed from './handlers/onGeneratorResumed';
import onStateChanged from './handlers/onStateChanged';
import onStateWillChange from './handlers/onStateWillChange';
import UnrecognizedEvent from './handlers/UnrecognizedEvent';
// eslint-disable-next-line no-unused-vars
import TimeDiff from './TimeDiff.jsx';
// eslint-disable-next-line no-unused-vars
import Settings from './Settings.jsx';

const handlers = {
  onMachineCreated,
  onMachineConnected,
  onMachineDisconnected,
  onActionDispatched,
  onActionProcessed,
  onGeneratorStep,
  onGeneratorEnd,
  onGeneratorResumed,
  onStateChanged,
  onStateWillChange
};

function calculateDiffTime(action, previousAction) {
  if (!previousAction) return 0;

  return action.time - previousAction.time;
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this._renderAction = this._renderAction.bind(this);
    this.state = {
      filterByTypes: null,
      source: null,
      snapshotIndex: null,
      settingsVisibility: false
    };
  }
  componentDidUpdate() {
    if (this.state.snapshotIndex === null) {
      this.log.scrollTop = this.log.scrollHeight;
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.actions.length === 1) {
      this.setState({ source: newProps.actions[0].uid });
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
  _onSourceChange(source) {
    this.setState({ source });
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
  _renderSourceSelector() {
    const options = this.props.actions.reduce((result, action) => {
      if (!result.find(o => o === action.uid)) result.push(action.uid);
      return result;
    }, []);

    return (
      <select onChange={ e => this._onSourceChange(e.target.value) } className='left mr1' key='filter3'>
        { options.map((uid, i) => <option value={ uid } key={ i }>{ `<source ${ i + 1 }>` }</option>) }
      </select>
    );
  }
  _renderAction(action, i) {
    const { filterByTypes, source } = this.state;
    // eslint-disable-next-line no-unused-vars
    const Component = handlers[action.type] || UnrecognizedEvent;

    // filter by source
    if (action.uid !== source) return null;

    // filter by type
    if (filterByTypes !== null) {
      if (action.type && filterByTypes.indexOf(action.type) < 0) {
        return null;
      } else if (action.label && filterByTypes.indexOf(action.label) <= 0) {
        return null;
      }
    }

    const timeDiff = calculateDiffTime(action, this.props.actions[i - 1]);
    const className =
      (action.type ? action.type : '') +
      ' actionRow relative' +
      (action.withMarker ? ' withMarker' : '');
    const style = action.color ? { backgroundColor: action.color } : {};

    return (
      <li
        key={ action.index }
        className={ className }
        onClick={ () => this._setSnapshotIndex(action.index) }
        style={ style }>
        { timeDiff > 0 && <TimeDiff diff={ timeDiff } /> }
        <Component {...action} />
        { this.snapshotIndex === action.index && <i className='fa fa-thumb-tack snapshotMarker'></i> }
      </li>
    );
  }
  _renderState() {
    const { actions } = this.props;
    const snapshotAction = actions[this.snapshotIndex];

    if (!snapshotAction) return null;
    if (snapshotAction.type in handlers) {
      return renderMachinesAsTree(snapshotAction.state);
    }
    return renderStateAsTree(snapshotAction.state);
  }
  render() {
    const { clear, marker, navViewState, navViewEvent, navViewAnalysis, navState, actions } = this.props;

    return (
      <div className='dashboard'>
        <div className='logLeft'>
          <div className='logNav'>
            { actions.length > 0 ? [
              <a onClick={ () => marker(this.state.snapshotIndex) } key='marker' className='ml05 mr1 try2'>
                <i className='fa fa-bookmark'></i>
              </a>,
              <a onClick={ () => clear() } key='clear' className='mr1 try2'>
                <i className='fa fa-ban'></i>
              </a>,
              <a onClick={ () => this.setState({ settingsVisibility: true }) } key='s' className='right mr05 try2'>
                <i className='fa fa-gear'></i>
              </a>,
              this._renderSourceSelector()
            ] : <p style={{ margin: '0.2em 0 0 0' }}>Waiting for events ...</p> }
          </div>
          <ul className='log' ref={ el => (this.log = el) }>
            { actions.map(this._renderAction) }
          </ul>
          { this.state.settingsVisibility && (
            <Settings
              onClose={ () => this.setState({ settingsVisibility: false }) }
              onChange={ types => this.setState({ filterByTypes: types }) }
              actions={ actions }
              types={ this.state.filterByTypes } />
          ) }
        </div>
        <div className='logRight'>
          { actions.length > 0 ? [
            <div className='logNav fullHeight' key='nav'>
              <a onClick={ navViewState } className={ navState === 'state' ? 'selected' : null }>
                <i className='fa fa-heart mr05'></i>State</a>
              <a onClick={ navViewEvent } className={ navState === 'event' ? 'selected' : null }>
                <i className='fa fa-dot-circle-o mr05'></i>Event</a>
              <a onClick={ navViewAnalysis } className={ navState === 'analysis' ? 'selected' : null }>
                <i className='fa fa-bar-chart-o mr05'></i>Analysis</a>
            </div>,
            <div className='logTree' key='content'>
              { navState === 'state' ? this._renderState() : null }
              { navState === 'event' ? renderActionAsTree(actions[this.snapshotIndex], actions) : null }
              { navState === 'analysis' ? 'Work in progress ...' : null }
            </div>
          ] : null }
        </div>
      </div>
    );
  }
};

export default connect(
  connect(Dashboard)
    .with('DevTools')
    .map(({ flushActions, addMarker }) => ({
      clear: () => flushActions(),
      marker: index => addMarker(index)
    }))
).with('Nav').map(n => {
  return {
    navViewState: n.viewState,
    navViewEvent: n.viewEvent,
    navViewAnalysis: n.viewAnalysis,
    navState: n.state.name
  };
});
