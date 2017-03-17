import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import rootReducer from './reducers';
import App from './components/App';
import MoviesPage from './containers/MoviesPage';
import MoviesNew from './containers/MoviesNew';
import MoviesAbout from './components/MoviesAbout';
import MoviesShow from './containers/MoviesShow';

const initialState = {
  movies: [
    { id: 1, title: 'A River Runs Through It' }
  ]
};

const store = createStore(rootReducer, initialState);

ReactDOM.render(
  <Provider store={store} >
    <Router history={browserHistory} >
      <Route path="/" component={App} />
      <Route path='/movies' component={MoviesPage}/>
    </Router>
  </Provider>,
  document.getElementById('container')
);
