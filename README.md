# Dynamic Routes in React Router

## Objectives

- Describe how to render JSX within a `Route`
- Describe how **React Router** allows nesting routes and URL parameters
- Explain how to organize routes in a standard **React Router** application

## Overview

In the previous lesson, we saw how to have routes dynamically render different
components. However, as you may have noticed, each time we rendered one
component, our previous component disappeared.

In this code-along, we'll look at how `Route`s can be written inside components
that are _themselves_ children of other `Route`s.

## Master/Detail Pattern Without Routes

Have you ever used Apple's Messages app for your Mac? What about YouTube? These
apps use some version of a "Master-Detail" interface: there is some piece of the
interface that provides access to the entire resource which we can use to select
specific items from. The resource might be a list of all messages, videos, or
emails. Clicking on one will trigger a more detailed display of that specific
item or action on **another portion of the screen** instead of displaying an
entirely new page. With this design, a user can navigate through many items in a
list, looking at item details without ever leaving the page they are on.

Consider how we might create this sort of design in regular React, without using
`Route`s: we could create two sibling components, one for the 'master' list, and
the other for the details of a specific item. We could call them `List` and
`Item`. Then, we create _one_ parent component for both that handles state. The
parent component could keep track of all the list data and which particular item
is currently selected, and pass down props to both components. This would work,
but there are limitations. One problem with this setup is that changing state
won't change the URL, meaning there is no way to provide a link directly to one
particular item from our list of resources.

Apps like YouTube display a list of videos, and clicking on any one video will
load it, but every time you open a particular video, _the URL changes_. YouTube
assigns unique values to each video (something like
[`dQw4w9WgXcQ`](https://www.youtube.com/watch?v=dQw4w9WgXcQ)). When viewing that
video, the value is listed as part of the URL. This value is a URL parameter and
allows for convenient sharing and bookmarking.

We've seen already that we can use **React Router** to alter the URL of a React
app. The challenge here though - how do we set up our `Route`s so that they can
produce URLs with parameters that correspond to resources we want to display in
our app?

## Nesting

So far, we've only seen `Route`s side by side, but that won't really work in
this example. When a list item is clicked, we want to see the details of that
item, but **we still want the list to display**.

Instead of listing two `Route`s side by side, with **React Router**, we can make
the master-detail pattern by making our `Item` component the _child_ of the
`List` component.

Think of YouTube again for a moment. Let's pretend that visiting `/videos`
displays a list of videos. Clicking on any video should keep our list of videos
on the page, but also display details on the selected video. This should be
updated in the URL - the URL should change to `/videos/:videoId`, where
`:videoId` is a unique value (this is slightly different than how YouTube works
but the concepts are similar). Using nested **React Router**, we can write our
application so one component, the `List` (of videos) renders using a `Route`
that matches the path `/videos`. Then, within `List`, we add a _second_ `Route`
that renders `Item` when the path matches `/videos/:videoId`.

Let's build this out!

#### Rendering Our List

To begin, let's take a look at our starter code. First, we have our `App`
component. `App` has some dummy movie data provided in state for us (normally,
we would likely be fetching this info).

```js
  const [movies, setMovies] = useState({
    1: { id: 1, title: 'A River Runs Through It' },
    2: { id: 2, title: 'Se7en' },
    3: { id: 3, title: 'Inception' }
  })
```

Our `index.js` file also has `Router` wrapping our `App`. All JSX wrapped within
`Router` can use `Route`s, including the JSX from any child components. In our
case, that is _all_ of our components.

`App` has two `Route` elements:

```js
  <Switch>
    <Route path="/movies">
      <MoviesPage movies={movies}/>
    </Route>
    <Route exact path="/">
      <div>Home</div>
    </Route>
  </Switch>
```

Looking at the `MoviesPage` component, this component is responsible for
loading our `MoviesList` component and passing in the movies we received from
`App`.

```javascript
// ./src/components/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from './MoviesList';

const MoviesPage = ({ movies }) => (
  <div>
    <MoviesList movies={movies} />
  </div>
)

export default MoviesPage
```

At the moment, our `MoviesPage` component is purely presentational. It is
simply the middle component between `App` and `MoviesList`, but we will come
back to this component in a moment. Right now, if we try to run our React app,
we get an error because `MoviesList` is not defined yet!

Let's create our `MoviesList` component to render **React Router** `Link`s for
each movie:

```js
// ./src/components/MoviesList.js
import React from 'react';
import { Link } from 'react-router-dom';

const MoviesList = ({ movies }) => {
  const renderMovies = Object.keys(movies).map(movieID => (
    <li key={movieID}>
      <Link to={`/movies/${movieID}`}>{movies[movieID].title}</Link>
    </li>
  ));

  return (
    <ul>
      {renderMovies}
    </ul>
  );
};

export default MoviesList;
```

The `movies` prop has been passed from `App` to `MoviesPage`, then again to
`MoviesList`. To make the code a little simpler, we've used
[object destructuring][] to get to `movies` directly, rather than have to write
`props.movies` in multiple places.

The `movies` prop is an object containing each movie. To iterate over this
object, we'll use `Object.keys(movies)` to get an array of keys, then map over
this array. Since the keys in the object _are also the id values for each
movie_, the elements in `.map()` are referred to as `movieID`. We can use
`movieID` directly in some of the attributes like `key`, but also use it to get
information from the `movies` object, as we see with `movies[movieID].title`.

In the `Link`, we've also used interpolation to create a dynamic path in `to`:

```js
to={`/movies/${movieID}`}
```

Now, if we start up the app, we'll see that if a user goes to the `/movies`
route, `MoviesList` will render a list of clickable router links. Clicking on
one of the movie names will cause the URL to display _that_ movie's id.

### Linking to the Show

Right now, we're using **React Router** to display the `MoviesPage` component
when the URL is `/movies`.

Next, we'll add in our first nested route within `MoviesPage` so that going to
`'/movies/:movieId'` will display details about a given movie using a
`MovieShow` component.

Before that, let's create our `MovieShow` component. Later on, we will
see that this component will need to dynamically figure out which Movie it
should render.

```javascript
// ./src/components/MovieShow.js
import React from "react";

const MovieShow = (props) => {
  return (
    <div>
      <h3>Movies Show Component!</h3>
    </div>
  );
};

export default MovieShow;
```

Next, we import `MovieShow` into `MoviesPage` and add a nested route in our
`src/components/MoviesPage.js` file to display the `MovieShow` container if that
route matches `/movies/:movieId`.

```javascript
// .src/components/MoviesPage.js
import React from "react";
// import the custom `useRouteMatch` hook from React Router
import { Route, useRouteMatch } from "react-router-dom";
import MoviesList from "../components/MoviesList";
// import the MovieShow component
import MovieShow from "./MovieShow";

const MoviesPage = ({ movies }) => {
  // useRouteMatch returns a special object with information about 
  // the currently matched route
  const match = useRouteMatch();
  console.log(match);

  return (
    <div>
      <MoviesList movies={movies} />
      
      {/* 
        we can use the current URL from the `match` object as part of the path,
        this will generate a url like "/movies/:movieId"
      */}
      <Route path={`${match.url}/:movieId`}>
        <MovieShow />
      </Route>
    </div>
  );
};

export default MoviesPage;

```

Above, we've imported our `MovieShow` component along with the
[`useRouteMatch`][useRouteMatch] hook from React Router, and added a `Route`
component. Calling `useRouteMatch()` inside our component gives us an object
that contains the current URL. Using `match`, we can show stuff depending on
what the `match.url` returns. We do this because we want the `Route` inside
`MoviesPage` to match the exact URL that caused `MoviesPage` to render, plus
`:movieId`. `:movieId` represents a parameter. If we visit
`http://localhost:3000/movies/1`, the `movieId` parameter would be `"1"`.

Going briefly back to our `MoviesList` component, remember that when `movies` is
mapped, our `Link`s are each getting a unique path in the `to={...}` attribute,
since each `movieID` is different.

```javascript
// ./src/components/MoviesList.js
import React from 'react';
import { Link } from 'react-router-dom';

const MoviesList = ({ movies }) => {
  const renderMovies = Object.keys(movies).map(movieID => (
    <li key={movieID}>
      <Link to={`/movies/${movieID}`}>{movies[movieID].title}</Link>
    </li>
  ));

  return (
    <ul>
      {renderMovies}
    </ul>
  );
};

export default MoviesList;
```

Refresh the page at `/movies`. Now, clicking a link changes the route, but we're
not actually seeing any content about that movie on our MovieShow page. You should 
only see the text `Movies Show Component!` under the navigation and movie links.

Just as we saw with `App`, the data we want to display on a particular
`MovieShow` page is available in its parent, `MoviesPage`, as props. For
`MovieShow` to display this content, we will need to make our movies collection
available within `MovieShow`.

```javascript
// .src/containers/MoviesPage.js
import React from "react";
import { Route, useRouteMatch } from "react-router-dom";
import MoviesList from "../components/MoviesList";
import MovieShow from "./MovieShow";

const MoviesPage = ({ movies }) => {
  const match = useRouteMatch();

  return (
    <div>
      <MoviesList movies={movies} />
      <Route path={`${match.url}/:movieId`}>
        
        {/* adding the movies object as a prop to MovieShow */}
        <MovieShow movies={movies} />
      </Route>
    </div>
  );
};

export default MoviesPage;

```

This isn't enough though - `MovieShow` now has all the movies, but it doesn't
know _which_ movie it should display. This information is _only available from the
URL_. Remember &mdash; when we click a `Link` to a movie, it adds that movie's
`id` to the URL as a parameter. We need to get that parameter out of the URL and
into `MovieShow`. Any guess as to how we might do that?

...

Just like we can use the `useRouteMatch` hook to get information about the URL
for the current route, we can also use another hook to get the dynamic `params`
from the URL: the [`useParams`][useParams] hook!

```js
// .src/components/MovieShow.js
import React from "react";
import { useParams } from "react-router-dom";

// Here we add `match` to the arguments so we can access the path information
// in `routerProps` that is passed from MoviesPage.js
const MovieShow = ({ movies }) => {
  // call useParams to access the `params` from the url:
  // the dynamic portion of our /movies/:movieId path
  const params = useParams();
  console.log(params);

  return (
    <div>
      {/*
        And here we access the `movieId` stored in `params` to render 
        information about the selected movie
      */}
      <h3>{movies[params.movieId].title}</h3>
    </div>
  );
};

export default MovieShow;
```

Here, we've got our `movies` as an object in props. We've also got our Router
props - from which we've extracted `match`. Within the `match` object is
`params`. In this case, we only have the one parameter, `movieId`, which we
defined in `MoviesPage`. Combining info from these two props lets us access the
specific movie whose key matches the `movieId` from the URL path, resulting in
the correct movie title being displayed!

We've succeeded in creating a "Master-Detail" interface - the list of movies is
always present when viewing a particular movie's details. Clicking through the
links changes the URL. With this setup, users of this site could bookmark or
share the URL for a specific movie!

### What Happens If We Only Visit the First Route?

With our main task completed, let's take a quick step back and ask a question -
what happens in this app when we visit `http://localhost:3000/movies` without a
particular `movieId` parameter? Well, `MoviesPage` renders due to the top-level
`/movies` `Route`, but `MoviesPage` will only render `MoviesList`. There is no
default `Route`, so we don't see anything. If we want to create a default 
`Route` here, we can do so using the `match` from `useRouteMatch()` once again:

```js
// .src/containers/MoviesPage.js
import React from "react";
import { Route, useRouteMatch } from "react-router-dom";
import MoviesList from "../components/MoviesList";
import MovieShow from "./MovieShow";

const MoviesPage = ({ movies }) => {
  const match = useRouteMatch();

  return (
    <div>
      <MoviesList movies={movies} />
      
      {/* Adding code to show a message to the user to select a movie if they haven't yet */}
      <Route exact path={match.url}>
        <h3>Choose a movie from the list above</h3>
      </Route>

      <Route path={`${match.url}/:movieId`}>
        <MovieShow movies={movies} />
      </Route>
    </div>
  );
};

export default MoviesPage;
```

Now, when we visit `http://localhost:3000/movies`, we see a message that only
appears if there is no additional `movieId` at the end of the URL. This is the
nested version of a default route. We can't just write `exact path="/"` since
these `Route`s will only render inside the `/movies` `Route`.

### Summary

To briefly review - we are able to nest `Route`s within each other. Using the
Router props we receive from the top-level `Route`, we can nest a second `Route`
that extends the URL path of the first. We can actually nest `Route`s as many
times as we would like, so if we wanted, we could go fully RESTful and create
nested `Route`s inside `MovieShow` as well, allowing us to write URL paths that 
would look something like this:

```test
http://localhost:3000/movies/:movieId/edit
```

To get nested `Route`s to work, we need to utilize route information from both
the `useRouteMatch` and `useParams` hooks. We can access the current route from
`useRouteMatch`. We define the parameter names in a `Route`'s path by prepending
a colon (`:`) to the front of the name. This name will then show up as a key
inside `params`.

We can use parameters to look up specific data - in this case matching the key
of a `movies` object with the URL parameter, `:movieId`, allowed us to display a
particular movie's title.

Nesting routes enables us to build single-page applications in React that
_behave_ like they have many pages. We can also load up and display specific
data dynamically.

In the early days of the internet, we would have had to create separate HTML
pages **_for each movie in this application_**. Now, with React, we can write
abstract components that fill in the data for each 'page' on demand. Very cool!

## Resources

- [useRouteMatch][]
- [useParams][]

[object destructuring]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[useRouteMatch]: https://reactrouter.com/web/api/Hooks/useroutematch
[useParams]: https://reactrouter.com/web/api/Hooks/useparams
