import React from 'react';
import ReactDOM from 'react-dom';
import './stent/machines';
import { connect } from 'stent/lib/react';
import page from './page';

console.log('Hello');
page.on(message => {
  console.log(message);
});

class App extends React.Component {
  componentDidMount() {
    this.props.locating();
  }
  render() {
    return <h1>Hello world !</h1>;
  }
};

const AppConnected = connect(App)
  .with('DevTools')
  .map(({ locating }) => ({ locating }));

ReactDOM.render(<AppConnected />, document.querySelector('#container'));


