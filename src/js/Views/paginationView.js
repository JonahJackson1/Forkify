import View from './view.js';
import icons from 'url:../../img/icons.svg';

export class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (numPages === 0)
      throw Error(
        'No recipes found for your query, please check your search and try again.'
      );
    // prettier-ignore
    const markup = `
    <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next ${currentPage === numPages && numPages > 1 ? 'hidden' : ''}">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    <div class="pagination__pages">${numPages} pages</div>
    <button data-goto="${currentPage - 1}"class="btn--inline pagination__btn--prev ${currentPage === 1 && numPages > 1 ? 'hidden' : ''}">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>
    `;

    if (numPages <= 1) return '';
    return markup;
  }
}
export default new PaginationView();
