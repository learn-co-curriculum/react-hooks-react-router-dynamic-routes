import React, { Component } from 'react';
import { Link } from 'react-router'

export class App extends Component {
  render() {
    return (
      <div className="App">
        <Link to="/recipes/new">Create Recipe </Link>
      </div>
    );
  }
}

export default App;
