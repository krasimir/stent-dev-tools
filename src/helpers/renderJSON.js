/* eslint-disable no-unused-vars */
import React from 'react';
import JSONTree from 'react-json-tree';
import treeTheme from '../helpers/treeTheme';

function labelRenderer(key, parentKey, a, rootKey) {
  return <strong>{ key[0] }</strong>;
}
function shouldExpandNode(keyName, data, level) {
  if (typeof data === 'object' && Object.keys(data).length > 5) {
    return false;
  }
  if (level < 2) {
    return true;
  }
  return false;
}
function valueRenderer(raw) {
  return <em>{raw}</em>;
}

const renderJSON = function (json) {
  return <JSONTree
    data={ json }
    theme={ treeTheme }
    getItemString={ function (type, data, itemType, itemString) {
      if (type === 'Array') return <span>// array ({ itemString })</span>;
      return null;
    } }
    labelRenderer={ labelRenderer }
    shouldExpandNode={ shouldExpandNode }
    valueRenderer={ valueRenderer }
    hideRoot={ true }
  />;
};

export default renderJSON;
