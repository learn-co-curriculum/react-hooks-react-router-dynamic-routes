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

describe('addIngredients', () => {
  it('displays a list of all of the ingredients in the store', () => {
    let store = configureStore()
    sinon.stub(store, 'getState').returns({ingredients: [{id: 1, name: 'dough'},
      {id: 2, name: 'tomato sauce'}, {id: 3, name: 'cheese'}
    ], recipeForm: {ingredientIds: [1, 2]}});
    const wrapper = mount(
      <Provider store={store}>
        < ConnectedAddIngredients />
      </Provider>
    )
    let WrapperConnectedAddIngredients = wrapper.find(ConnectedAddIngredients).first()
    let WrapperAddIngredients = wrapper.find(AddIngredients).first()
    expect(WrapperAddIngredients.text()).to.include('dough')
    expect(WrapperAddIngredients.text()).to.include('tomato sauce')
  });

  it('displays an addIngredient component for each ingredient', () => {
    let store = configureStore()

    let selectedIngredients = [{id: 1, name: 'dough'},
      {id: 2, name: 'tomato sauce'}]
    let unselectedIngredients = [{id: 3, name: 'cheese'}]
    let ingredients = [{id: 1, name: 'dough'},
      {id: 2, name: 'tomato sauce'}, {id: 3, name: 'cheese'}
      ]
    const addIngredients = shallow(< AddIngredients
      selectedIngredients={selectedIngredients}
      unselectedIngredients={unselectedIngredients}
      ingredients={ingredients}/>)
    expect(addIngredients.find(ConnectedAddIngredient).length).to.equal(unselectedIngredients.length)
    expect(addIngredients.find('li').length).to.equal(selectedIngredients.length)
  })
})

describe('addIngredient', () => {
  it('displays an addIngredient component for each ingredient', () => {
    let store = configureStore()
    let ingredient = {id: 1, name: 'dough'}
    const wrapper = mount(
      <Provider store={store}>
        < ConnectedAddIngredient {...ingredient} />
      </Provider>
    )
    let WrapperConnectedAddIngredient = wrapper.find(ConnectedAddIngredient).first()
    let WrapperAddIngredient = wrapper.find(AddIngredient).first()
    const button = WrapperAddIngredient.find('button').first()
    button.simulate('click')
    expect(store.getState().recipeForm.ingredientIds).to.include(ingredient.id)
  })
})

describe('addIngredients with Recipe', () => {

  it('updates the store when the form is submitted', () => {
    let store = configureStore()
    store.getState().recipeForm = {ingredientIds: [1, 2]}
      const wrapper = mount(
        <Provider store={store}>
          < ConnectedRecipesInput />
        </Provider>
      )

      console.log(store.getState().recipeForm)
      let WrapperConnectedRecipesInput = wrapper.find(ConnectedRecipesInput).first()
      let WrapperRecipesInput = wrapper.find(RecipesInput).first()
      let recipeNameInput = wrapper.find('input').first()
      recipeNameInput.simulate('change', { target: { value: 'mushrooms' } })
      let form = WrapperRecipesInput.find('form').first()
      form.simulate('submit',  { preventDefault() {} })
      expect(store.getState().recipes[0]).to.deep.include({name: 'mushrooms'})
      let recipe = store.getState().recipes[0]
      expect(recipe.ingredientIds).to.include(1)
      expect(recipe.ingredientIds).to.include(2)
    })
})
