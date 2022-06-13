import View from './view.js';

export class SearchView extends View {
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    if (!this._searchInputfield) {
      this._searchInputfield =
        this._parentElement.querySelector('.search__field');
    }
    const query = this._searchInputfield.value;
    this._clearInputfield();
    return query;
  }

  _clearInputfield() {
    this._searchInputfield.value = '';
  }
}
