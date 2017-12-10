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
import SagaEffectTriggered from './handlers/SagaEffectTriggered';
import SagaEffectResolved from './handlers/SagaEffectResolved';
import SagaEffectActionDispatched from './handlers/SagaEffectActionDispatched';
import SagaEffectCanceled from './handlers/SagaEffectCanceled';
import SagaEffectRejected from './handlers/SagaEffectRejected';
import ReduxAction from './handlers/ReduxAction';
// eslint-disable-next-line no-unused-vars
import TimeDiff from './TimeDiff.jsx';
// eslint-disable-next-line no-unused-vars
import Settings from './Settings.jsx';
// eslint-disable-next-line no-unused-vars
import { AutoSizer, List } from 'react-virtualized';

const StentHandlers = {
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
const Handlers = {
  '@saga_effectTriggered': SagaEffectTriggered,
  '@saga_effectResolved': SagaEffectResolved,
  '@saga_actionDispatched': SagaEffectActionDispatched,
  '@saga_effectCancelled': SagaEffectCanceled,
  '@saga_effectRejected': SagaEffectRejected,
  '@redux_ACTION': ReduxAction
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this._renderEvent = this._renderEvent.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);
    this.state = {
      filterByTypes: null,
      source: null,
      settingsVisibility: false
    };
  }
  componentWillReceiveProps(newProps) {
    if (newProps.events.length > 1) {
      this.setState({ source: newProps.events[0].uid });
    }
  }
  _onSourceChange(source) {
    this.setState({ source });
  }
  _renderSourceSelector() {
    const options = this.props.events.reduce((result, event) => {
      if (!result.find(o => o === event.uid)) result.push(event.uid);
      return result;
    }, []);

    return (
      <select onChange={ e => this._onSourceChange(e.target.value) } className='left mr1' key='filter3'>
        { options.map((uid, i) => <option value={ uid } key={ i }>{ `<source ${ i + 1 }>` }</option>) }
      </select>
    );
  }
  _renderEvent(event) {
    const { pinnedEvent, pin } = this.props;
    const { type, withMarker, color, timeDiff } = event;
    // eslint-disable-next-line no-unused-vars
    const Component = StentHandlers[type] || Handlers[type] || UnrecognizedEvent;
    const isPinned = (pinnedEvent || {})['id'] === event.id;

    const className =
      (type ? type : '') +
      ' actionRow relative' +
      (withMarker ? ' withMarker' : '') +
      (isPinned ? ' pinned' : '');
    const style = color ? { backgroundColor: color } : {};

    return (
      <li
        key={ event.id }
        className={ className }
        onClick={ () => pin(event.id) }
        style={ style }>
        <TimeDiff timeDiff={ timeDiff } />
        <div className='actionRowContent'>
          <Component {...event} />
        </div>
      </li>
    );
  }
  _renderState() {
    const { pinnedEvent } = this.props;

    if (!pinnedEvent) return null;
    if (pinnedEvent.type in StentHandlers) {
      return renderMachinesAsTree(pinnedEvent.state);
    }
    return renderStateAsTree(pinnedEvent.state);
  }
  _changeSettingsVisibility(eventsToRender) {
    this.setState({ settingsVisibility: !this.state.settingsVisibility });
    if (eventsToRender.length > 0) {
      this.props.pin(eventsToRender[eventsToRender.length - 1].id);
    }
  }
  _rowRenderer(eventsToRender, { index, isScrolling, isVisible, key, parent, style }) {
    return (
      <div key={ key } style={style} >
        { this._renderEvent(eventsToRender[index]) }
      </div>
    );
  }
  render() {
    const { filterByTypes, source } = this.state;
    const {
      clear,
      marker,
      navViewState,
      navViewEvent,
      navViewAnalysis,
      navState,
      events,
      pinnedEvent
    } = this.props;

    if (events.length === 0) {
      return <p style={{ margin: '0.2em 0 0 0' }}>Waiting for events ...</p>;
    }

    const eventsToRender = events.filter(({ uid, type }) => {
      // filter by source
      if (uid !== source) return false;
      // filter by type
      if (filterByTypes !== null && (type && filterByTypes.indexOf(type) < 0)) {
        return false;
      }
      return true;
    });

    return (
      <div className='dashboard'>
        <div className='logLeft'>
          <div className='logNav'>
            <a onClick={ () => marker() } key='marker' className='ml05 mr1 try2'>
              <i className='fa fa-bookmark'></i>
            </a>
            <a onClick={ () => clear() } key='clear' className='mr1 try2'>
              <i className='fa fa-ban'></i>
            </a>
            <a onClick={ () => this._changeSettingsVisibility(eventsToRender) }
              key='s'
              className='right mr05 try2'>
              <i className='fa fa-gear'></i>
            </a>
            { this._renderSourceSelector() }
          </div>
          <ul className='log'>
            { /* events.map(this._renderEvent) */ }
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={ l => (this.list = l) }
                  rowRenderer={ (...args) => this._rowRenderer(eventsToRender, ...args) }
                  height={ height }
                  rowCount={ eventsToRender.length }
                  rowHeight={ 28 }
                  width={ width }
                  scrollToIndex={ !pinnedEvent ? -1 : eventsToRender.findIndex(e => e.id === pinnedEvent.id) }/>
              )}
            </AutoSizer>
          </ul>
          { this.state.settingsVisibility && (
            <Settings
              onClose={ () => this._changeSettingsVisibility(eventsToRender) }
              onChange={ types => this.setState({ filterByTypes: types }) }
              events={ events }
              types={ this.state.filterByTypes } />
          ) }
        </div>
        <div className='logRight'>
          <div className='logNav fullHeight' key='nav'>
            <a onClick={ navViewState } className={ navState === 'state' ? 'selected' : null }>
              <i className='fa fa-heart mr05'></i>State</a>
            <a onClick={ navViewEvent } className={ navState === 'event' ? 'selected' : null }>
              <i className='fa fa-dot-circle-o mr05'></i>Event</a>
            <a onClick={ navViewAnalysis } className={ navState === 'analysis' ? 'selected' : null }>
              <i className='fa fa-bar-chart-o mr05'></i>Analysis</a>
          </div>
          <div className='logTree' key='content'>
            { navState === 'state' ? this._renderState() : null }
            { navState === 'event' ? renderEventAsTree(pinnedEvent) : null }
            { navState === 'analysis' ? 'Work in progress ...' : null }
          </div>
        </div>
      </div>
    );
  }
};

export default connect(
  connect(Dashboard)
    .with('DevTools')
    .map(({ state, flushEvents, addMarker, pin }) => {
      return {
        clear: () => flushEvents(),
        marker: () => addMarker(),
        pin: id => pin(id),
        pinnedEvent: state.pinnedEvent,
        events: state.events
      };
    })
).with('Nav').map(n => {
  return {
    navViewState: n.viewState,
    navViewEvent: n.viewEvent,
    navViewAnalysis: n.viewAnalysis,
    navState: n.state.name
  };
});
