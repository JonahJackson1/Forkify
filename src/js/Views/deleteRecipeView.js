import View from './view.js';
import icons from 'url:../../img/icons.svg';

export class DeleteRecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  addHandlerDelete(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (!e.target.classList.contains('delete--recipe')) return;
      const hash = window.location.hash.substring(1);
      handler(hash);
    });
  }
  generateMarkup() {
    const markup = `
    <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>Recipe successfully deleted!</p>
        </div>
      </div>
      `;
    this._parentElement.innerHTML = markup;
  }
}

export default new DeleteRecipeView();
