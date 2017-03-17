# Nested Routes in React Router

## Objectives

1. Describe how __React Router__ allows nesting routes
2. Explain how to organize routes in a standard __React & React Router__ application

## Overview

In the previous lesson, we saw how to have routes dynamically render different components. However, as you may have noticed, each time we rendered one component, our previous component disappeared. In this lesson, we'll see how routes can be used to specify multiple components to render.  

## Master Detail Without Routes

Have you ever used Apple's Messages app for your Mac? How about GMail? What about YouTube? All of those apps use some version of a "Master-Detail" interface. This is when there is something pertaining to the entire resource, such as a list of all messages, videos, or emails, and some more detailed display of a specific item or action on another portion of the screen. Clicking on a new item in the list changes which item we have selected.

## Nesting

With __React-Router__, we can make accomplish the master detail pattern by making our components children of each other. Take YouTube for example. Let's pretend that visiting `/videos` displays a list of videos. Clicking on any video keeps our list of videos on the page, but also displays details on the selected video. This should be updated by the URL - the URL should have changed to `/videos/:id`. The VideoDetail in this case is a 'Nested Component' of `'/videos'` - it will always have the list rendered before it.

## Code Along

### Rendering Our List

To begin, let's take a look at our starter code. First, we have a __MoviesPage__ component. This component is responsible for connecting to our store and loading our list of movies. A common pattern in __Redux__ is to refer to these as __container__ components and put them in a __containers__ directory. Here we've named ours __MoviesPage__ - again, a common naming pattern for container components.

```javascript
// ./src/containers/MoviesPage.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators}  from 'redux';
import { fetchMovies } from '../actions';
import MoviesList from '../components/MoviesList';

class MoviesPage extends Component {
  render() {
    return (
      <div>
        <MoviesList movies={this.props.movies} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    movies: state.movies
  };
}

export default connect(mapStateToProps)(MoviesPage);
```

We using the __mapStateToProps()__ function to pull the `movies` property from our store's state and attach it to the `props` of this component. As you see, our __MoviesPage__ just renders out a __MoviesList__ component. In this case, our __MoviesList__ component is purely presentational.

```javascript
// ./src/components/MoviesList.js

import React from 'react';

export default (props) => {

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
```

 Our Movie list will be our 'master' list on the left side. We're using Bootstrap's column classes to define how much of the screen our __MoviesList__ component should take up, but we could easily write our own classes or use the columns from a different framework.

### Linking to the Show

Right now, we're using __React Router__ to display the __MoviesPage__ component when the url is `/movies`. Let's add in our first nested route - going to '/movies/:id' should display details about a given movie.

First, let's create a __MoviesShow__ component. Later on, we will see that this component will need to connect to the store in order to figure out which Movie it should render, so let's put it in our `containers` directory.

>Note: Remember, containers are components that are directly connected to the store via the connect function.   

```javascript
// ./src/containers/MoviesShow.js

import React from 'react';

export default (props) => {
  
  return (
    <div>
      Movies Show Component!
    </div>
  );
}
```

Next, let's add a nested route in our `index.js` file.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import rootReducer from './reducers';
import App from './components/App';
import MoviesPage from './containers/MoviesPage';
import MoviesNew from './containers/MoviesNew';
import MoviesAbout from './components/MoviesAbout';
import MoviesShow from './containers/MoviesShow';

const initialState = {
  movies: [ 
    { id: 1, title: 'A River Runs Through It' } 
  ]
};

const store = createStore(rootReducer, initialState);

ReactDOM.render(
  <Provider store={store} >
    <Router history={browserHistory} >
      <Route path="/" component={App} />
      <Route path='/movies' component={MoviesPage}>
        <Route path="/movies/:id" component={MoviesShow} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('container')
);
```

Let's take a look at what we did differently here.  Inside of the __Route__ that points to  `/movies` is yet another __Route__ called  `/movies/:id`. One last step, and then we'll take a look at what this did.

Let's add links in our __MoviesList__ component so that we can click on different movies. To do this, we'll use the __Link__ component that __React Router__ gives us.

```javascript
// ./src/components/MoviesList.js

import React from 'react';
import { Link } from 'react-router';

export default (props) => {

  const movies = props.movies.map(movie => 
    <li key={movie.id}>
      <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
    </li>
  );
  
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
```

Awesome! Refresh the page at `/movies`. Now, clicking a link changes the route, but we're not actually seeing any content that would be in our MoviesShow page. We only continue to see content from the MoviesList component. What gives?

### Understanding Children

Well to understand why this is not working, we first need to take another look at `this.props.children` in __React__.  Bear with me on a quick sidebar. But please take your time in understanding this. It's crucial to understanding nested routes in a __React & Redux__ application. Ok, let's go.

So far, every time that we have added a custom component, that component has been self-closing. For example:

```javascript
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Users extends Component {
  render () {
    return (
      <div>
        Users component
      </div>
    );
  }
};

class App extends Component {
  render() {
    return (
      <Users />
    );
  }
};

ReactDOM.render(
  <App />, 
  document.getElementById('root')
);
```

Now you can see that __App__ has __Users__ as its child component, and the component is self-closing. Contrast it with the following code:
```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    return (
      <Users >
        <div>Hello</div>
      </Users>
    );
  }
};

ReactDOM.render(
  <App />, 
  document.getElementById('root')
);
```

Here, we changed things such that a child of users is the div component with the word hello in it. This is new.

It's equivalent to passing the children props a value of that component. So if you prefer, you can think of the code as the following:

```javascript
...
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    
    const div = <div>Hello</div>;
    
    return (
      <Users children={div} />
    );
  }
};

ReactDOM.render(
  <App />, 
  document.getElementById('root')
);
```

Now we have set the children prop as the div specified above. However just like every other prop that we pass through, we still need to tell the __Users__ component how to use this information. Currently, we are not doing that. So we update our code to the following:

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Users extends Component {
  render() {
    return (
      <div>
        Users component
        {this.props.children}
      </div>
    );
  }
};
```

Let's also go back to passing our div element as a child to our Users component in the correct way.  

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    return (
      <Users >
        <div>Hello</div>
      </Users>
    );
  }
};

ReactDOM.render(
  <App />, 
  document.getElementById('root')
);
```

Now the div with the word Hello will display in our __Users__ component. So children is a natural way to keep some of the content in our component the same, with the ability to pass through other content. We use it the same way that we pass an argument to a function to allow the functions output to be flexible.  

The way it is implemented is by passing a separate child component in between the beginning the opening bracket and closing bracket of a parent component. Then we access that child component inside the parent, as one of the props.  Think of it like passing an argument to a function, it makes life easier.

### React Router takes advantage of this.props.children
Here's how __React Router__ ties in. When you use nested routes with __React Router__, the component pointed to in the nested route is set as to be a child of the component referenced in the parent route. So given the routes specified below, when you visit the url `/movies/3` __React Router__ renders the __MovieApp__ component, and sets the __MoviesShow__ component as the __MovieApp__ component's child.  

```javascript
ReactDOM.render(
  <Provider store={store} >
    <Router history={browserHistory} >
      <Route path="/" component={App} >
        <Route path='/movies' component={MoviePage} >
          <Route path="/movies/:id" component={MoviesShow} />
        </Route>
      </Route>
    </Router>
  </Provider>,
document.getElementById('container'));

// Here, MovieShow is a child of the MoviePage.  
```

The problem is, we never actually said *where* the children should render on the screen.  Let's do this.  

```javascript
// ./src/containers/MoviesPage.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators}  from 'redux';
import { fetchMovies } from '../actions';
import MoviesList from '../components/MoviesList';

class MoviesPage extends Component {
  render() {
    return (
      <div>
        <MoviesList movies={this.props.movies} />
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    movies: state.movies
  };
}

export default connect(mapStateToProps)(MoviesPage);
```

Now, any child components provided by __React Router__ will be rendered there. So when we visit movies/3, the __MoviesPages__ component should display along with the __MoviesShow__ component. Awesome! Refresh again - now we see our __MoviesShow__ component displayed at our dynamic route.

What we don't see is information particular to that movie, but we'll leave that for the next section.

### Summary

So far we saw how to set up our nested routes.  We do so by making one route a child of the another route.  For example, in our application above the Route pointing to `/movies` is a parent of the route pointing to `/movies/:id`.  Similarly when a user visits the child url, the component from the parent route still displays, and the component from the child url is set as a child. To display the child component, we must make use of `this.props.children`.

>Note: Understanding this.props.children frequently confounds students and pros alike. So feel free to take a break, and then review this codealong again.
