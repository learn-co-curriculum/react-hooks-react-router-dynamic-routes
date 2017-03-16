import React from 'react';
import { Provider } from 'react-redux';

import { createStore } from 'redux';

import rootReducer from '../src/reducers'
import { fetchPets } from '../src/actions'

const store = createStore(rootReducer);
store.dispatch(fetchPets());

export default ( props ) => {
  return (
    <Provider store={store}>
      { props.children }
    </Provider>
  )
}
