import { async } from 'regenerator-runtime';
import helper from '../others/helper.js';
import {
    makeForkifyAPI_URL_recipe,
    makeForkifyAPI_URL_search,
    makeForkifyAPI_URL_post,
    RESULTS_PER_PAGE,
    API_KEY
} from '../others/config.js'

export class Model {
    constructor() {
        this._state = {
            recipe: {},
            search: {
                query: '',
                results: [],
                page: 1,
                resultsPerPage: RESULTS_PER_PAGE,
            },
            bookmarks: []
        };
    }

    get state() {
        return this._state;
    }

    get isBookmarked() {
        return this._state.recipe.bookmarked;
    }

    _resetState() {
        // reinitialize page
        this._state.search.page = 1;
    }

    _init() {
        this._resetState();
        const storage = localStorage.getItem('bookmarks');
        if (storage) {
            this._state.bookmarks = JSON.parse(storage);
            // console.log(this._state.bookmarks);
        }
    }

    _createRecipeObject(data) {
        const { recipe } = data.data;
        return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && { key: recipe.key })
        };
    }

    async loadRecipe(id) {
        try {
            const data = await helper.ajax(makeForkifyAPI_URL_recipe(`${id}?key=${API_KEY}`), null);
            this._state.recipe = this._createRecipeObject(data);

            if (this._state.bookmarks.some(bookmark => bookmark.id === id)) {
                this._state.recipe.bookmarked = true;
            } else {
                this._state.recipe.bookmarked = false;
            }
        }
        catch (err) {
            throw err;
        }
    }

    async loadSearchedResults(query) {
        try {
            this._resetState();

            const data = await helper.ajax(makeForkifyAPI_URL_search(`${query}&key=${API_KEY}`));
            this._state.search.query = query;
            this._state.search.results = data.data.recipes.map(recipe => {
                return {
                    id: recipe.id,
                    title: recipe.title,
                    publisher: recipe.publisher,
                    sourceUrl: recipe.source_url,
                    image: recipe.image_url,
                    ...(recipe.key && { key: recipe.key })
                }
            });
        }
        catch (err) {
            throw err;
        }
    }

    getSearchResultsPage(page = this._state.search.page) {
        this._state.search.page = page;

        const start = (page - 1) * this._state.search.resultsPerPage;
        const end = page * this._state.search.resultsPerPage;

        return this._state.search.results.slice(start, end);
    }

    updateServings(newServings) {
        const oldServings = this._state.recipe.servings;
        this._state.recipe.ingredients.forEach(ing => {
            ing.quantity = (ing.quantity * newServings) / oldServings;
        });
        this._state.recipe.servings = newServings;
    }

    _persistBookmark() {
        localStorage.setItem('bookmarks', JSON.stringify(this._state.bookmarks));
    }

    addBookmark(recipe) {
        // Add recipe as a bookmark.
        this._state.bookmarks.push(recipe);

        // Mark current recipe as a bookmark.
        if (recipe.id === this._state.recipe.id) {
            this._state.recipe.bookmarked = true;
        }
        this._persistBookmark();
    }

    deleteBookmark(id) {
        // delete bookmark
        const index = this._state.bookmarks.findIndex(e => e.id === id);
        this._state.bookmarks.splice(index, 1);

        // mark current recipe as Not blocked.
        if (id === this._state.recipe.id) {
            this._state.recipe.bookmarked = false;
        }
        this._persistBookmark();
    }

    clearAllBookmarks() {
        localStorage.clear('bookmarks');
    }

    async uploadRecipe(newRecipe) {
        try {
            const ingredients = Object
                .entries(newRecipe)
                .filter(entry =>
                    entry[0].startsWith('ingredient') && entry[1] !== ''
                ).map(ing => {
                    const ingArr = ing[1].split(',').map(e => e.trim());
                    // const ingArr = ing[1].replaceAll(' ', '').split(',');

                    if (ingArr.length !== 3) {
                        throw new Error(`Wrong ingredient format!`);
                    }

                    const [quantity, unit, description] = ingArr;
                    return {
                        quantity: quantity ? Number(quantity) : null,
                        unit,
                        description
                    };
                });

            const recipe = {
                title: newRecipe.title,
                source_url: newRecipe.sourceUrl,
                image_url: newRecipe.image,
                publisher: newRecipe.publisher,
                cooking_time: Number(newRecipe.cookingTime),
                servings: Number(newRecipe.servings),
                ingredients,
            };

            const data = await helper.ajax(makeForkifyAPI_URL_post(`${API_KEY}`), recipe);
            console.log(data);
            this._state.recipe = this._createRecipeObject(data);
            this.addBookmark(this._state.recipe);
        }
        catch (err) {
            throw err;
        }
    }
}; // end-of-class
