// ./src/containers/MoviesPage.js
import React from 'react';
import { connect } from 'react-redux';
import MoviesList from '../components/MoviesList';

const MoviesPage = ({ movies }) => 
  <div>
    <MoviesList movies={movies} />
  </div>;

const mapStateToProps = (state) => {
  return {
    movies: state.movies
  };
}

export default connect(mapStateToProps)(MoviesPage);