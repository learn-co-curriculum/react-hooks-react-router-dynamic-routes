
import {combineReducers} from 'redux';
import petsReducer from './petsReducer';

export default combineReducers({
  pets: petsReducer
});
