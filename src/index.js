import React from 'react';
import ReactDOM from 'react-dom';
import store from './configureStore';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import App from './components/App';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} >
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root'))
