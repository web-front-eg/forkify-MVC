import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  constructor(parentClassName) {
    this._parentElement = document.querySelector(parentClassName);
    this._errorMessageRoot =
      'Failed to find the recipe. Please try another one!';
    this._messageRoot = '';
    this._data = [];
  }

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] if flase, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {Object} View instance
   * @author yoonsang Lee
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data) {
      return this.renderError();
    }

    if (Array.isArray(data) && data.length === 0) {
      return this.renderError();
    }

    // console.log(data);
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) {
      return markup;
    }

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data) {
      return this.renderError();
    }

    // console.log(data);
    this._data = data;
    // console.log(`up : ${this._data.servings + 1} / down : ${this._data.servings - 1}`);
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      // update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderError(errMsg = this._errorMessageRoot) {
    const markup = `<div class="error">
                      <div>
                        <svg>
                          <use href="${icons}#icon-alert-triangle"></use>
                        </svg>
                      </div>    
                      <p>${errMsg}</p>
                    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    console.error('💀', errMsg);
  }

  renderMessage(message = this._messageRoot) {
    const markup = `<div class="error">
                          <div>
                            <svg>
                              <use href="${icons}#icon-alert-triangle"></use>
                            </svg>
                          </div>    
                          <p>${message}</p>
                        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    console.log(message);
  }

  renderSpinner() {
    const markup = `<div class="spinner">
                          <svg>
                            <use href="${icons}#icon-loader"></use>
                          </svg>
                        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
