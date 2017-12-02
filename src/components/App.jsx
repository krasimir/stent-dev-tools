import React from 'react';
import ReactDOM from 'react-dom';
import { PAGES } from '../constants';
import { connect } from 'stent/lib/react';
import PageLog from './PageLog.jsx';

class App extends React.Component {
  _renderPage() {
    const { actions, page } = this.props;

    switch(page) {
      case PAGES.LOG: return <PageLog actions={ actions } />
    }
    return <p>...</p>;
  }
  render() {
    const { page } = this.props;

    return (
      <div>
        <nav>
          <i className='fa fa-heart logo' aria-hidden='true'></i>
          <a href='#' className={ page === PAGES.LOG ? 'selected' : ''}>Log</a>
          <a href='#' className={ page === PAGES.MACHINES ? 'selected' : ''}>Machines</a>
        </nav>
        { this._renderPage() }
      </div>
    );
  }
};

export default connect(App)
  .with('DevTools')
  .map(({ state }) => ({ page: state.page, actions: state.actions }));

