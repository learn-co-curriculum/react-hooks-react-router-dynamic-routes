export default function recipeForm(state = {ingredientIds: []}, action){
  switch (action.type) {
    case 'RECIPE_FORM_ADD_INGREDIENT':
      let ingredientIds = state.ingredientIds.concat(action.payload)
      return Object.assign({}, state, {ingredientIds: ingredientIds})
    default:
      return state;
  }
}
