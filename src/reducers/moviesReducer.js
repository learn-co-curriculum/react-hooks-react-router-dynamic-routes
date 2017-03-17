export default (state = [], action) => {
  switch (action.type) {

    case 'ADD_MOVIE':
      return [ ...state, action.movie ];

    case 'FETCH_MOVIES':
      return action.movies;

    default:
      return state;
  }
};
