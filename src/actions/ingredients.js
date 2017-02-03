export function createIngredient(ingredient){
  return {type: 'CREATE_INGREDIENT', payload: ingredient}
}
export function recipeFormAddIngredient(ingredientId){
  return {type: 'RECIPE_FORM_ADD_INGREDIENT', payload: ingredientId}
}
