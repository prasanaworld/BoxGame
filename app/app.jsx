import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";

/* Core game organims included*/
import BoxGame from './game_components/organisms/box-game';
import styles from './app.less';
import AppContent from './content/content';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="container">
          <BoxGame {...AppContent} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
	document.getElementById('app'),
  null
);
