/* eslint-disable no-unused-vars */

import onMachineCreated from './handlers/onMachineCreated';
import onMachineConnected from './handlers/onMachineConnected';
import onMachineDisconnected from './handlers/onMachineDisconnected';
import onActionDispatched from './handlers/onActionDispatched';
import onActionProcessed from './handlers/onActionProcessed';
import onGeneratorStep from './handlers/onGeneratorStep';
import onGeneratorEnd from './handlers/onGeneratorEnd';
import onGeneratorResumed from './handlers/onGeneratorResumed';
import onStateChanged from './handlers/onStateChanged';
import UnrecognizedAction from './handlers/UnrecognizedAction';

const NOP_HANDLER = () => [ null, '' ];

function calculateDiffTime(action, previousAction) {
  if (!previousAction) return 0;

  return action.time - previousAction.time;
};

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
  onStateWillChange: NOP_HANDLER
};

import React from 'react';

export default function Action({ action, snapshotIndex, lastActionTime, filteredOut }) {
  var actionRepresentation;

  const timeDiff = calculateDiffTime(action, lastActionTime);
  const className =
    (action.type ? action.type : '') +
    ' actionRow relative' +
    (filteredOut ? ' filteredOut' : '') +
    (action.withMarker ? ' withMarker' : '');
  const style = action.color ? { backgroundColor: action.color } : {};

  return (
    <li
      key={ action.index }
      className={ className }
      onClick={ () => this._setSnapshotIndex(action.index) }
      style={ style }>
      { timeDiff > 0 && <TimeDiff diff={ timeDiff } /> }
      { actionRepresentation[0] }
      { snapshotIndex === action.index && <i className='fa fa-thumb-tack snapshotMarker'></i> }
    </li>
  );
};

Action.handlers = handlers;
Action.NOP_HANDLER = NOP_HANDLER;
