import React, { Component } from 'react';
import Board from './Board.js';
import List from './List.js';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="list">
            <List />
        </div>
        <div className="board">
          <Board />
        </div>
      </div>
    );
  }
}

export default App;
