import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import { RecipesInput } from './components/recipes/RecipesInput'
import { Provider } from 'react-redux'
import { store } from './store.js'
import { Router, Route, browserHistory } from 'react-router'


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} />
      <Route path="/recipes/new" component={RecipesInput} />
    </Router>
  </Provider>,
  document.getElementById('root'));
