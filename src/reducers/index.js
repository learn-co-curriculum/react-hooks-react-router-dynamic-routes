import { combineReducers } from 'redux'

import ingredientsReducer from './ingredients'
import recipesReducer from './recipes'
import recipeFormReducer from './recipeForm'


export default combineReducers({
  ingredients: ingredientsReducer,
  recipes: recipesReducer,
  recipeForm: recipeFormReducer
})
