import React from "react";
import { useParams } from "react-router-dom";

// Here we add `match` to the arguments so we can access the path information
// in `routerProps` that is passed from MoviesPage.js
function MovieShow({ movies }) {
  // call useParams to access the `params` from the url:
  // the dynamic portion of our /movies/:movieId path
  const params = useParams();

  return (
    <div>
      {/*
        And here we access the `movieId` stored in `params` to render 
        information about the selected movie
      */}
      <h3>{movies[params.movieId].title}</h3>
    </div>
  );
}

export default MovieShow;
