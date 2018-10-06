import React, { Component } from 'react';
import logo from './logo.svg';
import logo2 from './bookflip.svg';

import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'

import Bookshelf from './Bookshelf/Bookshelf';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <img src={logo2} alt="logo" />
          <h1 className="App-title">Welcome to React Bookshelf</h1>
        </header>
        {/* <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        <Bookshelf />

      </div>
    );
  }
}
library.add(faStroopwafel)
export default App;
