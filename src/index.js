import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import App from './containers/App';

const initialState = {
  movies: [
    { id: 1, title: 'A River Runs Through It' },
    { id: 2, title: 'Se7en' },
    { id: 3, title: 'Inception' }
  ]
};

const store = createStore(rootReducer, initialState);

render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('root')
);