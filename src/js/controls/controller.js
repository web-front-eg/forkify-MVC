import 'regenerator-runtime/runtime'; // to polypill for async / await
import 'core-js/stable'; // to polypill the others

import {
  MODAL_CLOSING_DELAY
} from '../others/config.js';

import model from '../models/model.js';
import recipeView from '../views/recipeView.js';
import searchView from '../views/searchView.js';
import resultsView from '../views/resultsView.js';
import paginationView from '../views/paginationView.js';
import bookmarksView from '../views/bookmarksView.js';
import addRecipeView from '../views/addRecipeView.js';



// https://forkify-api.herokuapp.com/v2

// coming from parcel 
// if (module.hot) {
//   module.hot.accept();
// }

export default class Controller {
  static init() {
    model._init();
    const ctrl = new Controller();
    bookmarksView.addHandlerRender(ctrl.controlBookmarksInit);
    recipeView.addHandlerRender(ctrl.controlRecipes);
    recipeView.updateHandlerUpdateServings(ctrl.controlServings);
    recipeView.addHandlerBookmark(ctrl.controlBookmarks);
    searchView.addHandlerSearch(ctrl.controlSearchResults);
    paginationView.addHandlerClick(ctrl.controlPagination);
    addRecipeView.addHandlerUpload(ctrl.controlAddRecipe);
  }

  async controlRecipes() {
    try {
      // 1. get id.
      const id = window.location.hash.slice(1);
      if (!id) return;

      // 2. render spinner to notice loading.
      recipeView.renderSpinner();

      // 3. update results view to mark selected search result.
      resultsView.update(model.getSearchResultsPage());

      // 4. update bookmarks view.    
      bookmarksView.update(model.state.bookmarks);

      // 5. load recipes.
      await model.loadRecipe(id);

      // 6. render recipes.
      recipeView.render(model.state.recipe);
    }
    catch (err) {
      recipeView.renderError(err);
      console.error(err);
    }
  }

  async controlSearchResults() {
    try {
      // 1. render spinner to nothing loading.
      resultsView.renderSpinner();

      // 2. search and get query.
      const query = searchView.getQuery();
      if (!query) return;

      // 3. load searched results.
      await model.loadSearchedResults(query);

      // 4. render searched results.
      resultsView.render(model.getSearchResultsPage());

      // 5. render pagination lists.
      paginationView.render(model.state.search);
    }
    catch (err) {
      resultsView.renderError(err);
      console.error(err);
    }
  }

  controlPagination(goToPage) {
    // 1. render the new result of the searched results.
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 5. render the new pagination buttons.
    paginationView.render(model.state.search);
  }

  controlServings(newServings) {
    debugger;
    // update the recipe servings (in state).
    model.updateServings(newServings);
    // update the recipe view.
    recipeView.update(model.state.recipe);
  }

  controlBookmarks() {
    // 1. Add/Remove bookmarks.
    const recipe = model.state.recipe;
    if (!model.isBookmarked) {
      model.addBookmark(recipe);
    } else {
      model.deleteBookmark(recipe.id);
    }

    // 2. update recipe view.
    recipeView.update(recipe);

    // 3. update bookmarks. 
    bookmarksView.render(model.state.bookmarks);
  }

  controlBookmarksInit() {
    bookmarksView.render(model.state.bookmarks);
  }

  async controlAddRecipe(newRecipe) {
    try {
      // Show loading spinner
      addRecipeView.renderSpinner();

      // Upload new recipe.
      await model.uploadRecipe(newRecipe);
      console.log(model.state.recipe);

      // Render recipe
      recipeView.render(model.state.recipe);

      // Display the success message!
      addRecipeView.renderMessage();

      // Render bookmark
      bookmarksView.render(model.state.bookmarks);

      // Change ID in URL
      window.history.pushState(null, '', `#${model.state.recipe.id}`);
      // window.history.back();

      // Close form window
      setTimeout(function () {
        addRecipeView.toggleWindow();
      }, MODAL_CLOSING_DELAY * 1000);
    }
    catch (err) {
      addRecipeView.renderError(err);
    }
  }
};

