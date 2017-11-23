import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";

import BoxGame from './game_components/organisms/box-game';

import styles from './app.less';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="container">
          <BoxGame />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
	document.getElementById('app'), null
);
