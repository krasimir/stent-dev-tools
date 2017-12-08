/* eslint-disable no-unused-vars */

import React from 'react';
import ReactDOM from 'react-dom';
import { PAGES } from '../constants';
import { connect } from 'stent/lib/react';
import Dashboard from './Dashboard.jsx';

class App extends React.Component {
  _renderPage() {
    const { actions, page } = this.props;

    switch (page) {
      case PAGES.DASHBOARD: return <Dashboard actions={ actions } />;
    }
    return <p>...</p>;
  }
  render() {
    return (
      <div>
        { this._renderPage() }
      </div>
    );
  }
};

export default connect(App)
  .with('DevTools')
  .map(({ state }) => ({ page: state.page, actions: state.actions }));
