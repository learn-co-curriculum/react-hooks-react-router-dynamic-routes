import { expect } from 'chai';
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import React from 'react'
import { configureStore } from '../src/store'
import { Provider } from 'react-redux'
import recipesReducer from '../src/reducers/recipes'
import { store } from '../src/store'
import { Recipes, ConnectedRecipes } from '../src/components/recipes/Recipes'
import { RecipesInput, ConnectedRecipesInput } from '../src/components/recipes/RecipesInput'

describe('recipesReducer', () => {
  it('returns a default state of an empty array', () => {
      expect(recipesReducer(undefined, {type: '@@INIT'})).to.deep.equal([])
  });

  it('is used with combineReducers to produce a state with a key of recipes', ()=> {
    expect(store.getState().recipes).to.deep.equal([])
  })

  it('adds a new recipe', ()=> {
    let newStore = configureStore()
    store.dispatch({type: 'ADD_RECIPE', payload: {name: 'mushrooms', calories: 20}})
    expect(store.getState().recipes[0]).to.deep.include({name: 'mushrooms', calories: 20})
  })

  it('gives each recipe an id', ()=> {
    let newStore = configureStore()
    store.dispatch({type: 'ADD_RECIPE', payload: {name: 'mushrooms', calories: 20}})
    expect(store.getState().recipes[0].id.length > 0).to.equal(true)
  })

  it('gives each recipe an id', ()=> {
    let newStore = configureStore()
    store.dispatch({type: 'ADD_RECIPE', payload: {name: 'mushrooms', calories: 20}})
    store.dispatch({type: 'ADD_RECIPE', payload: {name: 'cheese', calories: 90}})
    store.dispatch({type: 'ADD_RECIPE', payload: {name: 'tomato sauce', calories: 60}})
    let recipeIds = store.getState().recipes.map(function(recipe){
      return recipe.id
    })
    function hasDuplicates(array) {
      return (new Set(array)).size !== array.length;
    }
    expect(hasDuplicates(recipeIds)).to.equal(false)
  })

})

describe('recipes component', () => {
  it('returns a state provided by the store', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          < ConnectedRecipes />
        </Provider>
      )
      let WrapperConnectedRecipes = wrapper.find(ConnectedRecipes).first()
      let WrapperRecipes = wrapper.find(Recipes).first()
      expect(WrapperRecipes.props().recipes).to.deep.equal([])
  });

  it('updates the props as more recipes are added to the stores state', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedRecipes />
        </Provider>
      )
      store.dispatch({type: 'ADD_RECIPE', payload: {name: 'mushrooms', calories: 30}})
      let WrapperConnectedRecipes = wrapper.find(ConnectedRecipes).first()
      let WrapperRecipes = wrapper.find(Recipes).first()
      expect(WrapperRecipes.props().recipes[0]).to.deep.include({name: 'mushrooms', calories: 30})
  });

  it('displays the recipes in the recipes component', ()=> {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedRecipes />
        </Provider>
      )
      store.dispatch({type: 'ADD_RECIPE', payload: {name: 'mushrooms', calories: 40}})
      store.dispatch({type: 'ADD_RECIPE', payload: {name: 'eggs', calories: 50}})
      let WrapperConnectedRecipes = wrapper.find(ConnectedRecipes).first()
      let WrapperRecipes = wrapper.find(Recipes).first()
      expect(WrapperRecipes.text()).to.include('mushrooms')
      expect(WrapperRecipes.text()).to.include('eggs')
  })
})


describe('recipes input', () => {
  it('has an add recipe type', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          < ConnectedRecipesInput />
        </Provider>
      )
      let WrapperConnectedRecipesInput = wrapper.find(ConnectedRecipesInput).first()
      let WrapperRecipesInput = wrapper.find(RecipesInput).first()
      expect(typeof(WrapperRecipesInput.props().addRecipe)).to.deep.equal('function')
  });

  it('updates the store', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          < ConnectedRecipesInput />
        </Provider>
      )
    let WrapperConnectedRecipesInput = wrapper.find(ConnectedRecipesInput).first()
    let WrapperRecipesInput = wrapper.find(RecipesInput).first()
    WrapperRecipesInput.props().addRecipe({name: 'mushrooms', calories: 80})
    expect(store.getState().recipes[0]).to.deep.include({name: 'mushrooms', calories: 80})
  })

  it('updates the store when the form is submitted', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          < ConnectedRecipesInput />
        </Provider>
      )
      let WrapperConnectedRecipesInput = wrapper.find(ConnectedRecipesInput).first()
      let WrapperRecipesInput = wrapper.find(RecipesInput).first()
      let recipeNameInput = wrapper.find('input').first()
      recipeNameInput.simulate('change', { target: { value: 'mushrooms' } })
      let form = wrapper.find('form').first()
      form.simulate('submit',  { preventDefault() {} })
      expect(store.getState().recipes[0]).to.deep.include({name: 'mushrooms'})
    })
})
