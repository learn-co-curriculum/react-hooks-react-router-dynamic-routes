# Nested Routes

## Learning Goals

- Create nested routes in React Router
- Use URL parameters in React Router
- Use the `useRouteMatch` and `useParams` hooks to access information about
  React Router's internal state

## Introduction

Have you ever used Apple's Messages app for your Mac? What about YouTube? These
apps use a type of **list/detail** interface which consists of a list of all
instances of a resource (messages, videos, emails, etc.) from which we can
select specific items. Clicking on one will trigger a more detailed display of
that specific item on **another portion of the screen** instead of displaying an
entirely new page. (You may also see this pattern referred to as the
master/detail pattern.) With this design, a user can navigate through many items
in a list, looking at item details without ever leaving the page they are on.

Consider how we might create this sort of design in regular React, without using
`Route`s: we could create two sibling components, one for the list, and the
other for the details of a specific item. We could call them `List` and `Item`.
Then, we create _one_ parent component for both that handles state. The parent
component could keep track of all the list data and which particular item is
currently selected, and pass down props to both components.

This would work, but there are limitations. One problem with this approach is
that changing state won't change the URL, meaning there is no way to provide a
link directly to one particular item from our list of resources.

Apps like YouTube display a list of videos, and clicking on any one video will
load it, but every time you open a particular video, _the URL changes_. YouTube
assigns unique values to each video (something like `dQw4w9WgXcQ`). When viewing
that video, the value is listed as part of the URL. This value is a URL
parameter and allows for convenient sharing and bookmarking.

```txt
https://www.youtube.com/watch?v=dQw4w9WgXcQ

https    :// www.youtube.com / watch ? v             = dQw4w9WgXcQ

protocol :// domain          / path  ? parameter_key = parameter_value
```

In this lesson, we will learn how to use React Router to set up the list/detail
pattern. Specifically, we will learn how to:

- set up nested `Route`s for list and item components such that clicking on an
  item will display its details _along with_ the list
- set up our `Route`s to produce shareable URLs, i.e., URLs that contain a
  parameter corresponding to the specific resource we want to display

Our final component hierarchy will look like this:

```txt
└── App
    ├── NavBar
    └── MoviesPage
        |   MoviesList
        └── MovieShow
```

The `App` component will render the `NavBar` and `MoviesPage` components and is
where we'll define our top-level `Route`s. The `MoviesPage` component will be
the parent to the two presentational components, `MoviesList` and `MovieShow`,
and is where we'll set up our nested route.

## Nesting

So far, we've only seen `Route`s side by side, but that won't really work in
this example. When a list item is clicked, we want to see the details of that
item, but **we still want the list to display**.

Instead of listing two `Route`s side by side, we can set up the list/detail
pattern by using React Router to make our `Item` component the _child_ of the
`List` component.

Think of YouTube again for a moment. Let's pretend that visiting `/videos`
displays a `List` of videos. Clicking on any video should keep our list of
videos on the page, but also display details for the selected video. In
addition, the URL should be updated to `/videos/:videoId`, where `:videoId` is a
unique value that identifies the selected video. (Note that this isn't exactly
how YouTube works but the concepts are similar.) Using nested React Router, we
can write our application so one component — the `List` of videos — renders
using a Route that matches the path `/videos`. Then, within the `List`, we can
nest a second Route that renders the appropriate `Item` when the path matches
`/videos/:videoId`.

Let's build this out!

## Rendering Our List

To begin, let's take a look at our starter code. First, we have our `App`
component. `App` has some dummy movie data provided in state for us (normally,
we would likely be fetching this info).

```jsx
const [movies, setMovies] = useState({
  1: { id: 1, title: "A River Runs Through It" },
  2: { id: 2, title: "Se7en" },
  3: { id: 3, title: "Inception" },
});
```

Looking at the `index.js` file, we see that we have `Router` wrapping our `App`.
All JSX wrapped within `Router` can use `Route`s, including the JSX from any
child components. In our case, that is _all_ of our components.

`App` has two `Route` elements:

```jsx
<Switch>
  <Route path="/movies">
    <MoviesPage movies={movies} />
  </Route>
  <Route exact path="/">
    <div>Home</div>
  </Route>
</Switch>
```

Looking at the `MoviesPage` component, this component is responsible for loading
our `MoviesList` component and passing in the movies we received from `App`.

```jsx
// ./src/components/MoviesPage.js
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
```

At the moment, our `MoviesPage` component doesn't do much. It is simply the
middle component between `App` and `MoviesList`, but we will come back to this
component in a moment. Right now, if we try to run our React app, we get an
error because `MoviesList` is not defined yet!

Let's create our `MoviesList` component to render a `<Link>` for each movie:

```jsx
// ./src/components/MoviesList.js
import React from "react";
import { Link } from "react-router-dom";

function MoviesList({ movies }) {
  const renderMovies = Object.keys(movies).map((movieID) => (
    <li key={movieID}>
      <Link to={`/movies/${movieID}`}>{movies[movieID].title}</Link>
    </li>
  ));

  return <ul>{renderMovies}</ul>;
}

export default MoviesList;
```

The `movies` prop has been passed from `App` to `MoviesPage`, then again to
`MoviesList`.

The `movies` prop is an object containing each movie. To iterate over this
object, we are using `Object.keys(movies)` to get an array of keys, then mapping
over this array. Since the keys in the object _are also the id values for each
movie_, the elements in `.map()` are referred to as `movieID`. We are using
`movieID` directly in the `key` attribute, and also using it to get information
from the `movies` object, as we see with `movies[movieID].title`.

In the `Link`, we've used interpolation to insert `movieID` into our path to
make it dynamic:

```jsx
to={`/movies/${movieID}`}
```

Now, if we start up the app, we'll see that if a user goes to the `/movies`
route, `MoviesList` will render a list of clickable router links. Clicking on
one of the movie names will update the URL to display _that_ movie's id. Next,
we'll add in our nested route within `MoviesPage` so that going to
`/movies/:movieId` will display details about a given movie using a `MovieShow`
component.

### Linking to the Individual Movie Page

To start, let's create our `MovieShow` component. Later on, we will see that
this component will need to dynamically figure out which movie it should render.

```jsx
// ./src/components/MovieShow.js
import React from "react";

function MovieShow() {
  return (
    <div>
      <h3>Movies Show Component!</h3>
    </div>
  );
}

export default MovieShow;
```

Next, we'll import `MovieShow` into `MoviesPage` and add a nested route in our
`src/components/MoviesPage.js` file to display the `MovieShow` container if the
route matches `/movies/:movieId`. We also need to import the
[`useRouteMatch`][use-route-match] hook from React Router, which we'll use to
identify the matched route.

```jsx
// .src/components/MoviesPage.js
import React from "react";
// import the custom `useRouteMatch` hook from React Router
import { Route, useRouteMatch } from "react-router-dom";
import MoviesList from "./MoviesList";
// import the MovieShow component
import MovieShow from "./MovieShow";

function MoviesPage({ movies }) {
  // useRouteMatch returns a special object with information about
  // the currently matched route
  const match = useRouteMatch();
  console.log(match);

  return (
    <div>
      <MoviesList movies={movies} />
      {/* 
        we can use the current URL from the `match` object as part of the path;
        this will generate a url like "/movies/:movieId"
      */}
      <Route path={`${match.url}/:movieId`}>
        <MovieShow />
      </Route>
    </div>
  );
}

export default MoviesPage;
```

In the code above, calling `useRouteMatch()` inside our component gives us an
object that contains the current URL. We have assigned that object to the
variable `match`, which we then use to specify what content to render.
Specifically, `match.url` gives us the `/videos` part of the url, and we append
the `:movieId` for the particular video we want to display. `:movieId`
represents a parameter. If we visit `http://localhost:3000/movies/1`, the value
of `movieId` will be `"1"`.

Going back to our `MoviesList` component, remember that when `movies` is mapped,
our `Link`s are each getting a unique path in the `to={...}` attribute, since
each `movieID` is different.

```jsx
// ./src/components/MoviesList.js
import React from "react";
import { Link } from "react-router-dom";

function MoviesList({ movies }) {
  const renderMovies = Object.keys(movies).map((movieID) => (
    <li key={movieID}>
      <Link to={`/movies/${movieID}`}>{movies[movieID].title}</Link>
    </li>
  ));

  return <ul>{renderMovies}</ul>;
}

export default MoviesList;
```

We have now set up the receiving end of the movie links so React knows what
component to render when an individual movie's link is clicked.

Refresh the page at `/movies`. Now, clicking a link changes the route, but we're
not actually seeing any content about that movie on our MovieShow page. You
should only see the text `Movies Show Component!` under the navigation and movie
links.

Just as we saw with `App`, the data we want to display on a particular
`MovieShow` page is available in its parent, `MoviesPage`, as props. For
`MovieShow` to display this content, we will need to make our movies collection
available within `MovieShow`.

```jsx
// .src/components/MoviesPage.js
import React from "react";
import { Route, useRouteMatch } from "react-router-dom";
import MoviesList from "./MoviesList";
import MovieShow from "./MovieShow";

function MoviesPage({ movies }) {
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
}

export default MoviesPage;
```

This isn't enough though — `MovieShow` now has all the movies, but it doesn't
know _which_ movie it should display. This information is _only available from
the URL_. Remember — when we click a `Link` to a movie, it adds that movie's
`id` to the URL as a **parameter**. We need to get that parameter out of the URL
and into `MovieShow`.

Just like we can use the `useRouteMatch` hook to get information about the URL
for the current route, we can also use another hook to get the dynamic `params`
from the URL: the [`useParams`][use-params] hook!

```jsx
// .src/components/MovieShow.js
import React from "react";
import { useParams } from "react-router-dom";

function MovieShow({ movies }) {
  // call useParams to access the `params` from the url
  const params = useParams();
  console.log(params);

  return (
    <div>
      {/* And here we access the `movieId` stored in `params` to render 
        information about the selected movie */}
      <h3>{movies[params.movieId].title}</h3>
    </div>
  );
}

export default MovieShow;
```

Here, we've got our `movies` as an object in props. We also have our `params`
object which was returned from `useParams` based on the current URL. In this
case, we only have the one parameter, `movieId`, which we defined in the
`<Route>` in `MoviesPage`. We retrieve the `movieId` for the desired movie from
the `params` object, then use that to access the movie from the `movies` object
resulting in the correct movie title being displayed!

We've succeeded in creating a list/detail interface in which the list of movies
is always present when viewing a particular movie's details. Clicking through
the links changes the URL. With this setup, users of this site could bookmark or
share the URL for a specific movie!

### Handling What Happens If We Only Visit the First Route

With our main task completed, let's take a quick step back and ask a question —
what happens in this app when we visit `http://localhost:3000/movies` without a
particular `movieId` parameter? Well, `MoviesPage` renders due to the top-level
`/movies` `Route`, but `MoviesPage` will only render `MoviesList`. There is no
default `Route`, so we don't see anything except the list. If we want to create
a default `Route` here — i.e., if we want to specify what users will see if they
navigate to `/movies` — we can do so using the `match` variable from
`useRouteMatch()` once again:

```jsx
// .src/components/MoviesPage.js
import React from "react";
import { Route, useRouteMatch } from "react-router-dom";
import MoviesList from "./MoviesList";
import MovieShow from "./MovieShow";

function MoviesPage({ movies }) {
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
}

export default MoviesPage;
```

Now, when we visit `http://localhost:3000/movies`, we see a message that only
appears if there is no additional `movieId` at the end of the URL. This is the
nested version of a default route. We can't just write `exact path="/"` since
these `Route`s will only render inside the `/movies` `Route`.

## Conclusion

As we have learned in this section, React Router enables us to set up routes
that allow our users to navigate to different "pages" in our applications. The
routes we define can be static (e.g., `/movies`) or we can include a _parameter_
(e.g., `/movies/:movie_id`) to make it dynamic. React Router will also update
the URL in the browser to reflect whichever page the user has navigated to.

We are also able to nest `<Route>` components within each other, which allows us
to build single-page applications in React that _behave_ like they have many
pages. Using the `useRouteMatch` hook, we can nest a second `Route` that extends
the URL path of the first. We can actually nest `Route`s as many times as we
would like, so if we wanted, we could go fully RESTful and create nested
`Route`s inside `MovieShow` as well, allowing us to write URL paths that would
look something like this:

```txt
http://localhost:3000/movies
http://localhost:3000/movies/new
http://localhost:3000/movies/:movieId
http://localhost:3000/movies/:movieId/edit
```

In this lesson, we learned how to set up nested routes to create a
**list/detail** interface. Specifically, we learned how we can display a list of
items along with details about an individual item on the same page. To get this
to work, we needed to complete the following steps:

- In the top-level component (`App.js` in this case), create our "parent" routes
  and render `<MoviesPage>`
- In `MoviesPage.js`, render `<MoviesList>`
- In `MoviesList.js`, iterate through the `movies` object and create a dynamic
  `Link` for each movie using its id
- Back in `MoviesPage.js`, import `useRouteMatch` and create the child route by
  combining the current url with the `:movie_id` parameter; inside the child
  route, render `<MovieShow>`, passing the `movies` object as props
- In `MovieShow.js`, import `useParams`; use the `:movie_id` from the params
  object to access the correct movie from the `movies` object and display it on
  the page

In setting up our nested routes, we made use of two hooks provided by React
Router: `useRouteMatch` and `useParams`. The first is used to retrieve the URL
of the current page, and the second allows us to access the value of any
parameters we're using in our routes. The two together, along with the `movies`
object, gave us all the tools we needed to create dynamic routes for individual
movies and to display a movie's information when its link is clicked.

In the early days of the internet, we would have had to create separate HTML
pages **for each movie in this application**. Now, with React, we can write
abstract components that fill in the data for each 'page' on demand. Very cool!

## Resources

- [useRouteMatch][use-route-match]
- [useParams][use-params]

[object destructuring]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[use-route-match]: https://v5.reactrouter.com/web/api/Hooks/useroutematch
[use-params]: https://v5.reactrouter.com/web/api/Hooks/useparams
