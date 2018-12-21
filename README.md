# Nested Routes in React Router

## Objectives

1. Describe how __React Router__ allows nesting routes
2. Explain how to organize routes in a standard __React & React Router__ application

## Overview

In the previous lesson, we saw how to have routes dynamically render different
components. However, as you may have noticed, each time we rendered one
component, our previous component disappeared. In this lesson, we'll see how
routes can be used to specify multiple components to render.  

## Master Detail Without Routes

Have you ever used Apple's Messages app for your Mac? How about Gmail? What
about YouTube? All of those apps use some version of a "Master-Detail"
interface. This is when there is something pertaining to the entire resource,
such as a list of all messages, videos, or emails, and some more detailed
display of a specific item or action on another portion of the screen. Clicking
on a new item in the list changes which item we have selected.

## Nesting

With __React-Router__, we can make the master-detail pattern by making our
components children of each other. Take YouTube for example. Let's pretend that
visiting `/videos` displays a list of videos. Clicking on any video keeps our
list of videos on the page, but also displays details on the selected video.
This should be updated by the URL - the URL should have changed to
`/videos/:videoId`. The VideoDetail in this case is a 'Nested Component' of
`'/videos'` - it will always have the list rendered before it.

## Code Along

#### Rendering Our List

To begin, let's take a look at our starter code. First we have our __App__
component. __App__ has some dummy movie data provided in state for us (normally,
we would likely be fetching this info). It also has `Router` wrapping everything
else. All JSX wrapped within `Router` can use `Route`s, including child
components. In our case, that is _all_ of our components.

__App__ has two `Route` elements:

```js
<Route exact path="/" render={() => <div>Home</div>} />
<Route path='/movies' render={routerProps => <MoviesPage {...routerProps} movies={this.state.movies}/>} />
```

Notice what is happening on the second `Route`. When rendering a component
through a `Route`, the component receives props _from_ the `Route` automatically
that contain information on the route, including the URL path that triggered the
`Route` to render. This is happening on _both_ of these `Route`s, but in the
first `Route`, it is auotmatically being passed down. The issue here is that, in
addition to Router props, we also want to pass in the data we have in state.

The easiest way to handle this is to use the `render`. The `render` attribute of
`Route` takes an anonymous function, and since `Route` is passing its own props
automatically, they are available as the argument for the function, called
`routerProps` here. Since the function is simply returning a component, we can
then pass in both `routerProps` and `this.state.movies` as props to the
`MoviesPage` component.

Looking at the __MoviesPage__ component, this component is responsible for
loading our __MovieList__ component and passing in the movies we received from
__App__.

```javascript
// ./src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from '../components/MoviesList';
import MovieShow from './MovieShow';

const MoviesPage = ({ movies }) => (
  <div>
    <MoviesList movies={movies} />
  </div>
)

export default MoviesPage

```

At the moment, our __MoviesPage__ component is purely presentational. It is
simply middle component between __App__ and __MoviesList__, but we will come
back to this component in a moment. Right now, if we try to run our React app,
we get an error because __MovieList__ is not defined yet!

Let's create our __MoviesList__ component to render __React Router__ `Link`s for
each movie.

```javascript
// ./src/components/MoviesList.js
import React from 'react';
import { Link } from 'react-router-dom';

const MoviesList = ({ movies }) => {
  const renderMovies = Object.keys(movies).map(movieID =>
    <Link key={movieID} to={`/movies/${movieID}`}>{movies[movieID].title}</Link>
  );

  return (
    <div>
      {renderMovies}
    </div>
  );
};

export default MoviesList;

```

Since the prop `movies` is an object containing each movie, in order to iterate
over it, we'll need to use `Object.keys(movies).map()`. Since the keys in the
object _are also the id values for each movie_, we can use `movieID` directly in
some of the attributes, but also use it to get information from the `movies`
object, as we see with `movies[movieID].title`. Now, when our app runs, if a
user hits to the `/movies` route, `MoviesList` will render a list of clickable
router links.

### Linking to the Show

Right now, we're using __React Router__ to display the __MoviesPage__ component
when the url is `/movies`. We'll need to add in our first nested route within
__MoviesPage__ so that going to '/movies/:movieId' will display details about a
given movie using a __MovieShow__ component.

Before that, let's create our __MovieShow__ component. Later on, we will
see that this component will need to dynamically figure out which Movie it
should render.

```javascript
// ./src/containers/MovieShow.js
import React from 'react';

const MovieShow = props => {

  return (
    <div>
      <h3>Movies Show Component!</h3>
    </div>
  );
}

export default MovieShow;
```

Next, we need to add a nested route in our `src/containers/MoviesPage.js` file
to display the MovieShow container if that route matches `/movies/:movieId`

```javascript
// .src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from '../components/MoviesList';
import MovieShow from './MovieShow';

const MoviesPage = ({ match, movies }) => (
  <div>
    <MoviesList movies={movies} />
    <Route exact path={match.url} render={() => (
      <h3>Please select a Movie from the list.</h3>
    )}/>
    <Route path={`${match.url}/:movieId`} component={MovieShow}/>
  </div>
)

export default MoviesPage
```

With the `MoviesPage` container we are now adding two `Route` components. You
will notice that we are inheriting `match` from `this.props` this is a POJO
(plain old Javascript object) that contains the current url. It is being passed
in as part of the Router props from __App__. Using `match`, we are able to show
stuff depending on what the `match.url` returns (in this example, it returns
`movies/`). In the 2nd `Route` component we are defining a path of
`${match.url}/:movieId`. This will load the __MovieShow__ component when the url
looks something like `movies/1`.

Going briefly back to our __MoviesList__ component, when `movies` is mapped, our
has `Link`s are each getting a unique path in the `to={...}` attribute, since
each `movieID` is different.

```javascript
// ./src/components/MoviesList.js
import React from 'react';
import { Link } from 'react-router-dom';

const MoviesList = ({ movies }) => {
  const renderMovies = Object.keys(movies).map(movieID =>
    <Link key={movieID} to={`/movies/${movieID}`}>{movies[movieID].title}</Link>
  );

  return (
    <div>
      {renderMovies}
    </div>
  );
};

export default MoviesList;
```

Refresh the page at `/movies`. Now, clicking a link changes the route,
but we're not actually seeing any content about that movie that would be in our
MovieShow page. You should only see the text `Movies Show Component!`.

Just as we saw with __App__ the data we want to display on a particular
__MovieShow__ page is available in its parent, __MoviesPage__, as props. In
order to to __MovieShow__ to display this content, we will need make our movies
collection available within __MovieShow__:

```javascript
// .src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from '../components/MoviesList';
import MovieShow from './MovieShow';

const MoviesPage = ({ match, movies }) => (
  <div>
    <MoviesList movies={movies} />
    <Route exact path={match.url} render={() => (
      <h3>Please select a Movie from the list.</h3>
    )}/>
    <Route path={`${match.url}/:movieId`} render={routerProps => <MovieShow movies={movies} {...routerProps} /> }/>
  </div>
)

export default MoviesPage
```

At this level, we don't know what `:movieId` is yet. We only know this info once
the Route has been triggered and the component, __MovieShow__ is rendered. This
means we'll need to modify our __MovieShow__ page:

```js
import React from 'react';

const MovieShow = ({match, movies}) => {
  return (
    <div>
      <h3>{ movies[match.params.movieId].title }</h3>
    </div>
  );
}

export default MovieShow;
```

Here, we've got our `movies` as an object in props. We've also got our Router
props, from which we've extracted `match`. Within the `match` object is
`params`, which contains any parameters from the URL path. In this case, we only
have one, `movieId`, which we defined in __MoviesPage__. Combining info from
these two props lets us access the specific movie that's ID matches the
`movieId` from the path, resulting in the correct movie title being displayed!


### Summary

So far we saw how to set up our nested routes. We did so by making two `Route`
components within __MoviesPage__. One `Route` component that renders a component
if it is a perfect match with the url or the nested `Route` if it includes the
`match.url` and the nested key (in this case :movieId).

If you're thinking to yourself that props seem to be getting a little out of
hand... well, you're right! Props can be unruly in complex apps, with multiple
layers of components. Adding in React Router can further complicate things.
Having to pass down _all_ of the movies to __MovieShow__ just to display one
movie _should_ feel weird. As we will soon learn, this issue can be solved using
Redux.


<p
class='util--hide'>View <a
href='https://learn.co/lessons/react-router-nested-routes'>React Router Nested
Routes</a> on Learn.co and start learning to code for free.</p>
