import React from "react";
import { Route } from "react-router-dom";
import MoviesList from "./MoviesList";

function MoviesPage({ movies }) {
  return (
    <div>
      <MoviesList movies={movies} />
    </div>
  );
}
export default MoviesPage;
