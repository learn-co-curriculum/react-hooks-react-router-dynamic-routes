# Nested Routes Lab

## Objectives

1. Build out a nested resource.
2. Implement a redirect using __React Router__.

## Instructions

Congratulations, you're working at __Petfinder__! Before we get to browse all of the cute puppies and kittens, let's build them using a __React__ app with a couple of routes.

You're coworkers have already built out a __PetsPage__ component to render out a list of all the Pets. Your assignment is as follows.

1. Create a __Route__ so that visiting `/pets` displays the __PetsPage__ component and renders the list of pets.
2. Visiting '/pets/:id' should display some detailed information about a particular pet.
3. Visiting '/pets/new' should display a form to create a new Pet. After create, the user should be redirected back to '/pets'.

> Note: the tests do no check for the routes. They only test the individual components. You will need to manually check that the routes are working in the browser by running `npm install && npm start` and going to localhost:8080
