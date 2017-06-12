import React from 'react';

const MoviesList = props => {

  const movies = props.movies.map(movie => <li key={movie.id}>{movie.title}</li>);
  
  return (
    <div>
      <div className='col-md-4'>
        <ul>
          {movies}
        </ul>
      </div>
    </div>
  );
};

export default MoviesList;
