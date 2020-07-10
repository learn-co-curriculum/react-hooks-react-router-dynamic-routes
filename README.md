# Nested Routes in React Router

## Objectives

- Describe how to render JSX within a `Route`
- Describe how __React Router__ allows nesting routes and URL parameters
- Explain how to organize routes in a standard __React & React Router__
  application

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
video, the value is listed as part of the URL.  This value is a URL parameter
and allows for convenient sharing and bookmarking.

We've seen already that we can use __React-Router__ to alter the URL of a React
app. The challenge here though - how do we set up our `Route`s so that they can
produce URLs with parameters that correspond to resources we want to display in
our app?

## Nesting

So far, we've only seen `Route`s side by side, but that won't really work in
this example. When a list item is clicked, we want to see the details of that
item, but **we still want the list to display**.

Instead of listing two `Route`s side by side, with __React-Router__, we can make
the master-detail pattern by making our `Item` component the _child_ of the
`List` component.

Think of YouTube again for a moment. Let's pretend that visiting `/videos`
displays a list of videos. Clicking on any video should keep our list of videos
on the page, but also display details on the selected video. This should be
updated in the URL - the URL should change to `/videos/:videoId`, where
`:videoId` is a unique value (this is slightly different than how YouTube works
but the concepts are similar). Using nested __React-Router__, we can write our
application so one component, the `List` (of videos) renders using a `Route`
that matches the path `/videos`. Then, within `List`, we add a _second_ `Route`
that renders `Item` when the path matches `/videos/:videoId`.

Let's build this out!

#### Rendering Our List

To begin, let's take a look at our starter code. First, we have our `App`
component. `App` has some dummy movie data provided in state for us (normally,
we would likely be fetching this info).

```js
 state = {
    movies: {
      1: { id: 1, title: 'A River Runs Through It' },
      2: { id: 2, title: 'Se7en' },
      3: { id: 3, title: 'Inception' }
    }
  }
```

`App` also has `Router` wrapping everything inside the JSX code. All JSX wrapped within
`Router` can use `Route`s, including the JSX from any child components. In our
case, that is _all_ of our components.

`App` has two `Route` elements:

```js
<Route exact path="/" render={() => <div>Home</div>} />
<Route path='/movies' render={routerProps => <MoviesPage {...routerProps} movies={this.state.movies}/>} />
```

> **Aside**: Notice that instead of the `component` prop, we're using `render`.
> The `render` prop works very similarly to `component`, but instead of passing
> an entire component in, we must pass a function that returns JSX. As we see in
> the example above, this means we can write JSX code directly, having the function
> return `<div>Home</div>`. Or, we can have the function return a component, like
> the second `Route` above.

Notice what is happening on the second `Route`. When rendering a component
through a `Route` with the `render` prop, the function accepts an argument,
`routerProps`. When the path matches the URL, the `Route` will call the function
inside `render` and pass in the current information available about the route,
including the URL path that caused the `Route` to render. This is not possible
with the regular `component` prop on `Route`s we've seen before.

So, if the URL path matches `/movies`, the function inside `render` is called.
The object that is passed in, `routerProps`, gets passed to the `MoviesPage`
component as props. Using the spread operator (`{...routerProps}`) will result 
in the creation of props for each key present inside the `routerProps` object. 
This isn't vital but is a helpful way to pass many props in without too much 
code clutter.

So, the component, `MoviesPage`, receives props _from_ the `Route` that contain
information on the route. In addition, we can also pass in other props, as we
see with `movies={this.state.movies}`.

Looking at the `MoviesPage` component, this component is responsible for
loading our `MoviesList` component and passing in the movies we received from
`App`.

```javascript
// ./src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from '../components/MoviesList';

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

Let's create our `MoviesList` component to render __React Router__ `Link`s for
each movie:

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

The `movies` prop has been passed from `App` to `MoviesPage`, then again to
`MoviesList`. To make the code a little simpler, we've used
[object destructuring][] to get to `movies` directly, rather than have to write
`props.movies` in multiple places.

[object destructuring]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

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

Right now, we're using __React Router__ to display the `MoviesPage` component
when the URL is `/movies`.

Next, we'll add in our first nested route within `MoviesPage` so that going to
`'/movies/:movieId'` will display details about a given movie using a
`MovieShow` component.

Before that, let's create our `MovieShow` component. Later on, we will
see that this component will need to dynamically figure out which Movie it
should render.

```javascript
// ./src/components/MovieShow.js
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

Next, we import `MovieShow` into `MoviesPage` and add a nested route in our
`src/containers/MoviesPage.js` file to display the `MovieShow` container if that
route matches `/movies/:movieId`.

```javascript
// .src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from '../components/MoviesList';
// import the `MovieShow` component:
import MovieShow from '../components/MovieShow';

// Here we add `match` to the arguments so we can access the path information 
// in `routerProps` that is passed from App.js 
const MoviesPage = ({ match, movies }) => (
  <div>
    <MoviesList movies={movies} />
    // We also add a `Route` component that will render `MovieShow`
    // when a movie is selected
    <Route path={`${match.url}/:movieId`} component={MovieShow}/>
  </div>
)

export default MoviesPage
```

Above, we've  imported `MovieShow` and added a `Route` component. You will
notice that we are now inheriting `match` from `this.props`. This comes from the
`routerProps` passed in from `App`. This is a POJO (plain old Javascript object)
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

Refresh the page at `/movies`. Now, clicking a link changes the route, but we're
not actually seeing any content about that movie on our MovieShow page. You should 
only see the text `Movies Show Component!` under the navigation and movie links.

Just as we saw with `App`, the data we want to display on a particular
`MovieShow` page is available in its parent, `MoviesPage`, as props. For
`MovieShow` to display this content, we will need to make our movies collection
available within `MovieShow`.

```javascript
// .src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from '../components/MoviesList';
import MovieShow from '../components/MovieShow';

const MoviesPage = ({ match, movies }) => (
  <div>
    <MoviesList movies={movies} />
    // Adding code to pass the movies to the `MovieShow` component
    <Route path={`${match.url}/:movieId`} component={<MovieShow movies={movies} /> }/>
  </div>
)

export default MoviesPage
```

This isn't enough though - `MovieShow` now has all the movies, but it doesn't
know _which_ movie it should display. This information is _only available from the
URL_. Remember &mdash; when we click a `Link` to a movie, it adds that movie's
`id` to the URL as a parameter. We need to get that parameter out of the URL and
into `MovieShow`. Any guess as to how we might do that?

...

If you recall from the earlier `Route`s in `App`, by using a `Route`'s `render`
prop, we can **pass in a function that has access to information about the route
itself**. We can rewrite the `Route` in `MoviesPage` to do this:

```javascript
// .src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from '../components/MoviesList';
import MovieShow from '../components/MovieShow';

const MoviesPage = ({ match, movies }) => (
  <div>
    <MoviesList movies={movies} />
    // Here we replace the `component` prop with the `render` prop so we can pass the 
    // route information to the `MovieShow` component
    <Route path={`${match.url}/:movieId`} render={routerProps => <MovieShow {...routerProps} movies={movies} /> }/>
  </div>
)

export default MoviesPage
```

Now, all the key/value pairs within `routerProps` are also passed into
`MovieShow` as props. Just like before, one of the props we receive from the
`Route` is `match`, and `match` contains **all the parameters from
the URL!** These parameters are stored as key/value pairs in `match.params`.
The key corresponds to whatever we named the parameter in our `Route`, so in
this case, the parameter will be `movieId`. We can update `MovieShow` to utilize
this parameter in conjunction with the `movies` data that was passed down:

```js
// .src/components/MovieShow.js
import React from 'react';

// Here we add `match` to the arguments so we can access the path information 
// in `routerProps` that is passed from MoviesPage.js 
const MovieShow = ({match, movies}) => {
  return (
    <div>
      // And here we access the `movieId` stored in match.params to render 
      // information about the selected movie
      <h3>{ movies[match.params.movieId].title }</h3>
    </div>
  );
}

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
`Route` here, we can do so using the `match` prop once again:

```js
// .src/containers/MoviesPage.js
import React from 'react';
import { Route } from 'react-router-dom';
import MoviesList from '../components/MoviesList';
import MovieShow from '../components/MovieShow';

const MoviesPage = ({ match, movies }) => (
  <div>
    <MoviesList movies={movies} />
    // Adding code to show a message to the user to select a movie if they haven't yet
    <Route exact path={match.url} render={() => <h3>Choose a movie from the list above</h3>}/>
    <Route path={`${match.url}/:movieId`} render={routerProps => <MovieShow {...routerProps} movies={movies} /> }/>
  </div>
)

export default MoviesPage
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

To get nested `Route`s to work, we need to utilize route information that is
stored in the `match` props. `match` contains both the current URL path in
`match.url`, as well as any parameters in `match.params`. We define the
parameter names in a `Route`'s path by prepending a colon (`:`) to the front of
the name. This name will then show up as a key inside `match.params`. 

We can use parameters to look up specific data - in this case matching the key
of a `movies` object with the URL parameter, `:movieId`, allowed us to display a
particular movie's title.

Nesting routes enables us to build single-page applications in React that
_behave_ like they have many pages. We can also load up and display specific
data dynamically.

In the early days of the internet, we would have had to create separate HTML
pages **_for each movie in this application_**. Now, with React, we can write
abstract components that fill in the data for each 'page' on demand. Very cool!
