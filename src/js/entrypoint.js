import Controller from './controls/controller.js';

import { Model } from './models/model.js';
import * as Views from './views';

// https://forkify-api.herokuapp.com/v2

// coming from parcel
// if (module.hot) {
//   module.hot.accept();
// }

const model = new Model();

const views = {
  recipeView: new Views.RecipeView('.recipe'),
  searchView: new Views.SearchView('.search'),
  resultsView: new Views.ResultsView('.results'),
  paginationView: new Views.PaginationView('.pagination'),
  bookmarksView: new Views.BookmarksView('.bookmarks__list'),
  addRecipeView: new Views.AddRecipeView('.upload'),
};

const controller = new Controller(model, views);
