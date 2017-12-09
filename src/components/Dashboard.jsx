import React from 'react';
import { connect } from 'stent/lib/react';
import { renderMachinesAsTree, renderEventAsTree, renderStateAsTree } from '../helpers/renderAsTree';
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
// eslint-disable-next-line no-unused-vars
import { AutoSizer, List } from 'react-virtualized';

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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this._renderEvent = this._renderEvent.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);
    this.state = {
      filterByTypes: null,
      source: null,
      snapshotIndex: null,
      settingsVisibility: false
    };
  }
  componentDidUpdate() {
    // if (this.state.snapshotIndex === null) {
    //   this.log.scrollTop = this.log.scrollHeight;
    // }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.events.length === 1) {
      this.setState({ source: newProps.events[0].uid });
    }
  }
  get snapshotIndex() {
    const { snapshotIndex } = this.state;
    const { events } = this.props;

    return snapshotIndex === null ? events.length - 1 : snapshotIndex;
  }
  _setSnapshotIndex(index) {
    this.setState({ snapshotIndex: index === this.props.events.length - 1 ? null : index });
  }
  _onSourceChange(source) {
    this.setState({ source });
  }
  _renderSourceSelector() {
    const options = this.props.events.reduce((result, action) => {
      if (!result.find(o => o === action.uid)) result.push(action.uid);
      return result;
    }, []);

    return (
      <select onChange={ e => this._onSourceChange(e.target.value) } className='left mr1' key='filter3'>
        { options.map((uid, i) => <option value={ uid } key={ i }>{ `<source ${ i + 1 }>` }</option>) }
      </select>
    );
  }
  _renderEvent(event, indexInTheArray) {
    const { filterByTypes, source } = this.state;
    const { type, uid, withMarker, color, timeDiff } = event;
    // eslint-disable-next-line no-unused-vars
    const Component = handlers[type] || UnrecognizedEvent;

    // filter by source
    if (uid !== source) return null;

    // filter by type
    if (filterByTypes !== null && (type && filterByTypes.indexOf(type) < 0)) {
      return null;
    }

    const className =
      (type ? type : '') +
      ' actionRow relative' +
      (withMarker ? ' withMarker' : '');
    const style = color ? { backgroundColor: color } : {};

    return (
      <li
        key={ event.index }
        className={ className }
        onClick={ () => this._setSnapshotIndex(indexInTheArray) }
        style={ style }>
        <TimeDiff timeDiff={ timeDiff } />
        <Component {...event} />
        { this.snapshotIndex === indexInTheArray && <i className='fa fa-thumb-tack snapshotMarker'></i> }
      </li>
    );
  }
  _renderState() {
    const { events } = this.props;
    const snapshotAction = events[this.snapshotIndex];

    if (!snapshotAction) return null;
    if (snapshotAction.type in handlers) {
      return renderMachinesAsTree(snapshotAction.state);
    }
    return renderStateAsTree(snapshotAction.state);
  }
  _changeSettingsVisibility() {
    this.setState({ settingsVisibility: !this.state.settingsVisibility });
  }
  _rowRenderer({ index, isScrolling, isVisible, key, parent, style }) {
    return (
      <div key={ key } style={style} >
        { this._renderEvent(this.props.events[index], index) }
      </div>
    );
  }
  render() {
    const { clear, marker, navViewState, navViewEvent, navViewAnalysis, navState, events } = this.props;

    return (
      <div className='dashboard'>
        <div className='logLeft'>
          <div className='logNav'>
            { events.length > 0 ? [
              <a onClick={ () => marker(this.state.snapshotIndex) } key='marker' className='ml05 mr1 try2'>
                <i className='fa fa-bookmark'></i>
              </a>,
              <a onClick={ () => clear() } key='clear' className='mr1 try2'>
                <i className='fa fa-ban'></i>
              </a>,
              <a onClick={ () => this._changeSettingsVisibility() } key='s' className='right mr05 try2'>
                <i className='fa fa-gear'></i>
              </a>,
              this._renderSourceSelector()
            ] : <p style={{ margin: '0.2em 0 0 0' }}>Waiting for events ...</p> }
          </div>
          <ul className='log'>
            { /* events.map(this._renderEvent) */ }
            <AutoSizer>
              {({ height, width }) => (
                <List
                  rowRenderer={ this._rowRenderer }
                  height={ height }
                  rowCount={ events.length }
                  rowHeight={ 28 }
                  width={ width }
                  scrollToIndex={ this.state.snapshotIndex === null ? events.length - 1 : -1 }/>
              )}
            </AutoSizer>
          </ul>
          { this.state.settingsVisibility && (
            <Settings
              onClose={ () => this.setState({ settingsVisibility: false }) }
              onChange={ types => this.setState({ filterByTypes: types }) }
              events={ events }
              types={ this.state.filterByTypes } />
          ) }
        </div>
        <div className='logRight'>
          { events.length > 0 ? [
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
              { navState === 'event' ? renderEventAsTree(this.snapshotIndex, events) : null }
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
    .map(({ flushEvents, addMarker }) => ({
      clear: () => flushEvents(),
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
