export default (state = [], action) => {
  switch (action.type) {
    case 'FETCH_PETS':
      return action.pets;
    case 'ADD_PET':
      const pet = Object.assign({}, action.pet, { id: state.length + 1} );
      return [ ...state, pet ];
    default:
      return state;
  }
};
