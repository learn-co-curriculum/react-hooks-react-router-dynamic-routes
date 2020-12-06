import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from './MoviesList';

const MoviesPage = ({ movies }) => (
  <div>
    <MoviesList movies={movies} />
  </div>
)

export default MoviesPage