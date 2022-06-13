import { icons } from 'url:../../img/icons.svg'; // Parcel 2
import View from './view.js';

export class PaginationView extends View {
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      e.preventDefault();

      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      handler(Number(btn.dataset.goto));
    });
  }

  _generateMarkup() {
    // ceil in cases which the number isn't divided by 10
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;

    // page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupNextPage(currentPage + 1);
    }

    // last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupPrevPage(currentPage - 1);
    }

    // other page
    if (currentPage < numPages) {
      return (
        this._generateMarkupPrevPage(currentPage - 1) +
        this._generateMarkupNextPage(currentPage + 1)
      );
    }

    // no matched results
    return '';
  }

  _generateMarkupPrevPage(page) {
    return `<button data-goto="${page}" class="btn--inline pagination__btn--prev">
                      <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                      </svg>
                      <span>Page ${page}</span>
                    </button>`;
  }

  _generateMarkupNextPage(page) {
    return `<button data-goto="${page}" class="btn--inline pagination__btn--next">
                      <span>Page ${page}</span>
                      <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                      </svg>
                    </button>`;
  }
}
