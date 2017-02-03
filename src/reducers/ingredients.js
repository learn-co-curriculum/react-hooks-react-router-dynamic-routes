import uuidV4  from 'uuid/v4';

export default function ingredients(state = [], action){
  switch (action.type) {
    case 'CREATE_INGREDIENT':
      let ingredient = Object.assign({}, action.payload, {id: uuidV4()})
      return state.concat(ingredient)
    default:
      return state;
  }
}

export function unselectedIngredients(ingredients, selectedIngredientIds){
  return ingredients.filter(function(ingredient){
      return selectedIngredientIds.includes(ingredient.id)
  })
}

export function findIngredientById(id, ingredients){
  return ingredients.find(function(ingredient){
    return ingredient.id === id
  })
}
