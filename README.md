# Nested Routes in React Router

## Objectives

1. Describe how __React Router__ allows nesting routes
2. Explain how to organize routes in a standard __React & React Router__ application

## Overview

In the previous lesson, we saw how to have routes dynamically render different components. However, as you may have noticed, each time we rendered one component, our previous component disappeared. In this lesson, we'll see how routes can be used to specify multiple components to render.  

## Master Detail Without Routes

Have you ever used Apple's Messages app for your Mac? How about Gmail? What about YouTube? All of those apps use some version of a "Master-Detail" interface. This is when there is something pertaining to the entire resource, such as a list of all messages, videos, or emails, and some more detailed display of a specific item or action on another portion of the screen. Clicking on a new item in the list changes which item we have selected.

## Nesting

With __React-Router__, we can make the master-detail pattern by making our components children of each other. Take YouTube for example. Let's pretend that visiting `/videos` displays a list of videos. Clicking on any video keeps our list of videos on the page, but also displays details on the selected video. This should be updated by the URL - the URL should have changed to `/videos/:videoId`. The VideoDetail in this case is a 'Nested Component' of `'/videos'` - it will always have the list rendered before it.

## Code Along

### Rendering Our List

To begin, let's take a look at our starter code. First, we have a __MoviesPage__ component. This component is responsible for connecting to our store and loading our list of movies. A common pattern in __Redux__ is to refer to these as __container__ components and put them in a __containers__ directory. Here we've named ours __MoviesPage__ - again, a common naming pattern for container components.

```javascript
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
```

We are using the __mapStateToProps()__ function to pull the `movies` property from our store's state and attach it to the `props` of this component. As you see, our __MoviesPage__ just renders out a __MoviesList__ component. In this case, our __MoviesPage__ component is purely presentational.

Let's create our MoviesList component to render __React Router__ Links for each movie. 

```javascript
// ./src/components/MoviesList.js
import React from 'react';
import { Link } from 'react-router-dom';

const MoviesList = ({ movies }) => {
  const renderMovies = movies.map(movie => 
    <Link key={movie.id} to={`/movies/${movie.id}`}>{movie.title}</Link>
  );
  
  return (
    <div>
      {renderMovies}
    </div>
  );
};

export default MoviesList;

```

### Linking to the Show

Right now, we're using __React Router__ to display the __MoviesPage__ component when the url is `/movies` (You can look at the code in `/src/containers/App.js`). Let's add in our first nested route so that going to '/movies/:movieId' will display details about a given movie using a __MoviesShow__ component.

Let's create our __MoviesShow__ component. Later on, we will see that this component will need to connect to the store in order to figure out which Movie it should render, but first let's put it in our `containers` directory.

>Note: Remember, containers are components that are directly connected to the store via the connect function.   

```javascript
// ./src/containers/MoviesShow.js
import React from 'react';

const MoviesShow = props => {
  
  return (
    <div>
      <h3>Movies Show Component!</h3>
    </div>
  );
}

export default MoviesShow;
```

Next, we need to add a nested route in our `src/containers/MoviesPage.js` file to display the MovieShow container if that route matches `/movies/:movieId`

```javascript
// .src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import MoviesList from '../components/MoviesList';
import MovieShow from './MovieShow';

const MoviesPage = ({ match, movies }) => 
  <div>
    <MoviesList movies={movies} />
    <Route path={`${match.url}/:movieId`} component={MovieShow}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a Movie from the list.</h3>
    )}/>
  </div>;

const mapStateToProps = (state) => {
  return {
    movies: state.movies
  };
}

export default connect(mapStateToProps)(MoviesPage);
```

With the `MoviesPage` container we are now adding two `Route` components. You will notice that we are inheriting `match` from `this.props` this is a POJO that contains the current url. so we are able to show stuff depending on what the `match.url` returns. In the 2nd `Route` component we are defining a path of `${match.url}/:movieId`. This will load the MovieShow component when the url looks something like `movies/1`.

Lets go ahead and make sure that our MoviesList component has links to get to this nested route. 

```javascript
// ./src/components/MoviesList.js
import React from 'react';
import { Link } from 'react-router-dom';

const MoviesList = ({ movies }) => {
  const renderMovies = movies.map(movie => 
    <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
  );
  
  return (
    <div>
      {renderMovies}
    </div>
  );
};

export default MoviesList;
```

Awesome! Refresh the page at `/movies`. Now, clicking a link changes the route, but we're not actually seeing any content about that movie that would be in our MoviesShow page. You should only see the text `Movies Show Component!`. Don't worry we will work on showing the movie details in the next lesson.

### Summary

So far we saw how to set up our nested routes. We do so by making two `Route` components. One `Route` component that renders a component if it is a perfect match with the url or the nested `Route` if it includes the `match.url` and the nested key (in this case :movieId).
<p class='util--hide'>View <a href='https://learn.co/lessons/react-router-nested-routes'>React Router Nested Routes</a> on Learn.co and start learning to code for free.</p>
