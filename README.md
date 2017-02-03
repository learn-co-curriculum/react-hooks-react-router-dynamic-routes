# Redux Put It Together

## Objectives

Use the react-redux library and the redux library to build an application with multiple resources.

## Overview

In this application we will be building an application to build a recipe application.  One resource will build out a resource of ingredients.  Another reducer will be used for a resource of recipes.  

To add ingredients to a recipe, each recipe will have a button for every added ingredient.  To add an ingredient, click on the button and see the ingredient added to the recipe immediately.  

As you may imagine, recipes will have many ingredients.  To represent this, we will have something like:

`{recipes: {name: 'cookies', ingredients: [1, 2, 3]} }` where the ingredients array holds the foreign key of the list of ingredients.
