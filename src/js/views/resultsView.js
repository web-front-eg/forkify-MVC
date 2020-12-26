import previewView from './previewView.js';
import View from './view.js';

class ResultsView extends View {
  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(result =>
      previewView.render(result, false))
      .join('');
  }
};

export default new ResultsView(
  document.querySelector('.results')
);