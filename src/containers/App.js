import React, { Component } from 'react';
import { 
  BrowserRouter as Router, 
  Route 
} from 'react-router-dom';
import NavBar from '../components/NavBar';
import MoviesPage from './MoviesPage';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Route exact path="/" render={() => <div>Home</div>} />
          <Route path='/movies' component={MoviesPage}/>
        </div>
      </Router>
    );
  }
}
 
export default App;