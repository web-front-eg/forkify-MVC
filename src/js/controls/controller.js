import 'regenerator-runtime/runtime'; // to polypill for async / await
import 'core-js/stable'; // to polypill the others

import { MODAL_CLOSING_DELAY } from '../others/config.js';

export class Controller {
  constructor(model, views) {
    this.#model = model;
    const {
      recipeView,
      searchView,
      resultsView,
      paginationView,
      bookmarksView,
      addRecipeView,
    } = views;

    this.#recipeView = recipeView;
    this.#searchView = searchView;
    this.#resultsView = resultsView;
    this.#paginationView = paginationView;
    this.#bookmarksView = bookmarksView;
    this.#addRecipeView = addRecipeView;

    this.bind();
  }

  bind() {
    this.#bookmarksView.addHandlerRender(this.#controlBookmarksInit.bind(this));
    this.#recipeView.addHandlerRender(this.#controlRecipes.bind(this));
    this.#recipeView.updateHandlerUpdateServings(
      this.#controlServings.bind(this)
    );
    this.#recipeView.addHandlerBookmark(this.#controlBookmarks.bind(this));
    this.#searchView.addHandlerSearch(this.#controlSearchResults.bind(this));
    this.#paginationView.addHandlerClick(this.#controlPagination.bind(this));
    this.#addRecipeView.addHandlerUpload(this.#controlAddRecipe.bind(this));
  }

  async #controlRecipes() {
    try {
      // 1. get id.
      const id = window.location.hash.slice(1);
      if (!id) return;

      // 2. render spinner to notice loading.
      this.#recipeView.renderSpinner();

      // 3. update results view to mark selected search result.
      this.#resultsView.update(this.#model.getSearchResultsPage());

      // 4. update bookmarks view.
      this.#bookmarksView.update(this.#model.state.bookmarks);

      // 5. load recipes.
      await this.#model.loadRecipe(id);

      // 6. render recipes.
      this.#recipeView.render(this.#model.state.recipe);
    } catch (err) {
      this.#recipeView.renderError(err);
      console.error(err);
    }
  }

  async #controlSearchResults() {
    try {
      // 1. render spinner to nothing loading.
      this.#resultsView.renderSpinner();

      // 2. search and get query.
      const query = this.#searchView.getQuery();
      if (!query) return;

      // 3. load searched results.
      await this.#model.loadSearchedResults(query);

      // 4. render searched results.
      this.#resultsView.render(this.#model.getSearchResultsPage());

      // 5. render pagination lists.
      this.#paginationView.render(this.#model.state.search);
    } catch (err) {
      this.#resultsView.renderError(err);
      console.error(err);
    }
  }

  #controlPagination(goToPage) {
    // 1. render the new result of the searched results.
    this.#resultsView.render(mthis.#odel.getSearchResultsPage(goToPage));

    // 5. render the new pagination buttons.
    this.#paginationView.render(mthis.#odel.state.search);
  }

  #controlServings(newServings) {
    debugger;
    // update the recipe servings (in state).
    this.#model.updateServings(newServings);
    // update the recipe view.
    this.#recipeView.update(this.#model.state.recipe);
  }

  #controlBookmarks() {
    // 1. Add/Remove bookmarks.
    const recipe = this.#model.state.recipe;
    if (!this.#model.isBookmarked) {
      this.#model.addBookmark(recipe);
    } else {
      this.#model.deleteBookmark(recipe.id);
    }

    // 2. update recipe view.
    this.#recipeView.update(recipe);

    // 3. update bookmarks.
    this.#bookmarksView.render(this.#model.state.bookmarks);
  }

  #controlBookmarksInit() {
    this.#bookmarksView.render(this.#model.state.bookmarks);
  }

  async #controlAddRecipe(newRecipe) {
    try {
      // Show loading spinner
      this.#addRecipeView.renderSpinner();

      // Upload new recipe.
      await this.#model.uploadRecipe(newRecipe);
      // console.log(this.#model.state.recipe);

      // Render recipe
      this.#recipeView.render(this.#model.state.recipe);

      // Display the success message!
      this.#addRecipeView.renderMessage();

      // Render bookmark
      this.#bookmarksView.render(this.#model.state.bookmarks);

      // Change ID in URL
      window.history.pushState(null, '', `#${this.#model.state.recipe.id}`);
      // window.history.back();

      // Close form window
      setTimeout(function () {
        this.#addRecipeView.toggleWindow();
      }, MODAL_CLOSING_DELAY * 1000);
    } catch (err) {
      this.#ddRecipeView.renderError(err);
    }
  }
}
