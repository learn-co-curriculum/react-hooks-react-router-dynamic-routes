import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import rootReducer from './reducers';
import App from './containers/App';
import MoviesPage from './containers/MoviesPage';

const initialState = {
  movies: [
    { id: 1, title: 'A River Runs Through It' }
  ]
};

const store = createStore(rootReducer, initialState);

render(
  <Provider store={store} >
    <Router>
      <div>
        <Route path="/" component={App} />
        <Route path='/movies' component={MoviesPage} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);