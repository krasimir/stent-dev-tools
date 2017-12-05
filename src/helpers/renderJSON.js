import React from 'react';
import JSONTree from 'react-json-tree';
import treeTheme from '../helpers/treeTheme';

const renderJSON = function (json) {
  return <JSONTree
    data={ json }
    theme={ treeTheme }
    getItemString={ function (type, data, itemType, itemString) {
      if (type === 'Array') return <span>// ({ itemString })</span>;
      return null;
    } }
  />;
};

export default renderJSON;
