export function makeForkifyAPI_URL_recipe(id) {
    return `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`;
}

export function makeForkifyAPI_URL_search(id) {
    return `https://forkify-api.herokuapp.com/api/v2/recipes?search=${id}`;
}

export function makeForkifyAPI_URL_post(id) {
    return `https://forkify-api.herokuapp.com/api/v2/recipes?key=${id}`;
}

export const TIMEOUT_SEC = 10;

export const RESULTS_PER_PAGE = 10;

export const API_KEY = '3f122b07-c390-4715-9953-7d5ee5c06d8c';

export const MODAL_CLOSING_DELAY = 2.5;