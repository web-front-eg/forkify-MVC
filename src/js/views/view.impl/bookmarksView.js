import previewView from './previewView.js';
import View from './view.js';

export class BookmarksView extends View {
  constructor(parentElement) {
    super(parentElement);

    this._errorMessageRoot =
      'No bookmarks yet. Find a nice recipe and bookmark it!';
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
