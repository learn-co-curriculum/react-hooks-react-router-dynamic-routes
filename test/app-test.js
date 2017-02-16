import { expect } from 'chai';
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import React from 'react'
import { configureStore } from '../src/store'
import { Provider } from 'react-redux'
import ingredientsReducer from '../src/reducers/ingredients'
import { store } from '../src/store'
import { AddIngredients, ConnectedAddIngredients } from '../src/components/ingredients/AddIngredients'
import { AddIngredient, ConnectedAddIngredient } from '../src/components/ingredients/AddIngredient'
import { RecipesInput, ConnectedRecipesInput } from '../src/components/recipes/RecipesInput'
import App from '../src/App'
import { Link, Router, Route, browserHistory } from 'react-router'

describe('addIngredients', () => {
  it('displays a list of all of the ingredients in the store', () => {
    let store = configureStore()
    sinon.stub(store, 'getState').returns({ingredients: [{id: 1, name: 'dough'},
      {id: 2, name: 'tomato sauce'}, {id: 3, name: 'cheese'}
    ], recipeForm: {ingredientIds: [1, 2]}});

      const wrapper = mount(
        <App />
      )
    expect(wrapper.find(Link).first().text()).to.include("Create Recipe")
    expect(wrapper.find(Link).first().props()).to.include({to: '/recipes/new'})

  });
})
