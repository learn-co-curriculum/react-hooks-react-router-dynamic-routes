import { expect } from 'chai';
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import React from 'react'
import { configureStore } from '../src/store'
import { Provider } from 'react-redux'
import ingredientsReducer from '../src/reducers/ingredients'
import { store } from '../src/store'
import { Ingredients, ConnectedIngredients } from '../src/components/ingredients/Ingredients'
import { IngredientsInput, ConnectedIngredientsInput } from '../src/components/ingredients/IngredientsInput'

describe('ingredientsReducer', () => {
  it('returns a default state of an empty array', () => {
      expect(ingredientsReducer(undefined, {type: '@@INIT'})).to.deep.equal([])
  });

  it('is used with combineReducers to produce a state with a key of ingredients', ()=> {
    expect(expect(store.getState().ingredients).to.deep.equal([]))
  })

  it('adds a new ingredient', ()=> {
    let newStore = configureStore()
    store.dispatch({type: 'CREATE_INGREDIENT', payload: {name: 'mushrooms', calories: 20}})
    expect(store.getState().ingredients[0]).to.deep.include({name: 'mushrooms', calories: 20})
  })

  it('gives each ingredient an id', ()=> {
    let newStore = configureStore()
    store.dispatch({type: 'CREATE_INGREDIENT', payload: {name: 'mushrooms', calories: 20}})
    expect(store.getState().ingredients[0].id.length > 0).to.equal(true)
  })

  it('gives each ingredient an id', ()=> {
    let newStore = configureStore()
    store.dispatch({type: 'CREATE_INGREDIENT', payload: {name: 'mushrooms', calories: 20}})
    store.dispatch({type: 'CREATE_INGREDIENT', payload: {name: 'cheese', calories: 90}})
    store.dispatch({type: 'CREATE_INGREDIENT', payload: {name: 'tomato sauce', calories: 60}})
    let ingredientIds = store.getState().ingredients.map(function(ingredient){
      return ingredient.id
    })
    function hasDuplicates(array) {
      return (new Set(array)).size !== array.length;
    }
    expect(hasDuplicates(ingredientIds)).to.equal(false)
  })

})

describe('ingredients component', () => {
  it('returns a state provided by the store', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          < ConnectedIngredients />
        </Provider>
      )
      let WrapperConnectedIngredients = wrapper.find(ConnectedIngredients).first()
      let WrapperIngredients = wrapper.find(Ingredients).first()
      expect(WrapperIngredients.props().ingredients).to.deep.equal([])
  });

  it('updates the props as more ingredients are added to the stores state', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedIngredients />
        </Provider>
      )
      store.dispatch({type: 'CREATE_INGREDIENT', payload: {name: 'mushrooms', calories: 30}})
      let WrapperConnectedIngredients = wrapper.find(ConnectedIngredients).first()
      let WrapperIngredients = wrapper.find(Ingredients).first()
      expect(WrapperIngredients.props().ingredients[0]).to.deep.include({name: 'mushrooms', calories: 30})
  });

  it('displays the ingredients in the ingredients component', ()=> {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedIngredients />
        </Provider>
      )
      store.dispatch({type: 'CREATE_INGREDIENT', payload: {name: 'mushrooms', calories: 40}})
      store.dispatch({type: 'CREATE_INGREDIENT', payload: {name: 'eggs', calories: 50}})
      let WrapperConnectedIngredients = wrapper.find(ConnectedIngredients).first()
      let WrapperIngredients = wrapper.find(Ingredients).first()
      expect(WrapperIngredients.text()).to.include('mushrooms')
      expect(WrapperIngredients.text()).to.include('eggs')
  })
})


describe('ingredients input', () => {
  it('has an add ingredient type', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          < ConnectedIngredientsInput />
        </Provider>
      )
      let WrapperConnectedIngredientsInput = wrapper.find(ConnectedIngredientsInput).first()
      let WrapperIngredientsInput = wrapper.find(IngredientsInput).first()
      expect(typeof(WrapperIngredientsInput.props().createIngredient)).to.deep.equal('function')
  });

  it('updates the store', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          < ConnectedIngredientsInput />
        </Provider>
      )
    let WrapperConnectedIngredientsInput = wrapper.find(ConnectedIngredientsInput).first()
    let WrapperIngredientsInput = wrapper.find(IngredientsInput).first()
    WrapperIngredientsInput.props().createIngredient({name: 'mushrooms', calories: 80})
    expect(store.getState().ingredients[0]).to.deep.include({name: 'mushrooms', calories: 80})
  })

  it('updates the store when the form is submitted', () => {
    let store = configureStore()
      const wrapper = mount(
        <Provider store={store}>
          < ConnectedIngredientsInput />
        </Provider>
      )
      let WrapperConnectedIngredientsInput = wrapper.find(ConnectedIngredientsInput).first()
      let WrapperIngredientsInput = wrapper.find(IngredientsInput).first()
      let ingredientNameInput = wrapper.find('input').first()
      ingredientNameInput.simulate('change', { target: { value: 'mushrooms' } })
      let caloriesInput = wrapper.find({type: 'text'}).last()
      caloriesInput.simulate('change', { target: { value: 40 } })
      let form = wrapper.find('form').first()
      form.simulate('submit',  { preventDefault() {} })
      expect(store.getState().ingredients[0]).to.deep.include({name: 'mushrooms', calories: 40})
  })
})
