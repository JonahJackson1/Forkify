import View from './view.js';
import icons from 'url:../../img/icons.svg';

class ShoppingList extends View {
  _parentElement = document.querySelector('.modal');
  _modalContent = document.querySelector('.modal-content');
  _openModalNav = document.querySelector('.nav__btn--shopping-list');

  _recipeContainer = document.querySelector('.recipe');

  addHandlerAddToShoppingList(handler) {
    this._recipeContainer.addEventListener('click', e => {
      if (!e.target.classList.contains('shopping--list__add')) return;
      this._parentElement.classList.add('show-modal');
      handler();
    });
    this._parentElement.addEventListener('click', e => {
      if (e.target.classList.contains('close-button'))
        this._parentElement.classList.remove('show-modal');
      if (e.target.classList.contains('modal'))
        this._parentElement.classList.remove('show-modal');
    });
    this._openModalNav.addEventListener('click', e => {
      if (!e.target.classList.contains('nav__btn--shopping-list')) return;
      this._parentElement.classList.add('show-modal');
    });
  }

  addHandlerRemoveFromShoppingList(handler) {
    this._modalContent.addEventListener('click', function (e) {
      if (!e.target.classList.contains('shopping--list-btn')) return;
      const nodeList = e.target.parentNode.childNodes;
      // console.log(nodeList);
      nodeList.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (!node.classList.contains('recipe__description')) return;
          handler(node.textContent.trim());
        }
      });
    });
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._modalContent.insertAdjacentHTML('beforeend', markup);
  }

  _generateMarkup() {
    const ingArr = Array.from(this._data);
    const markup = ingArr
      .map(ing => {
        return `
    <li class="recipe__ingredient shopping--list">
    <button class="recipe__icon shopping--list-btn">
      X
    </button>
    <div class="recipe__description">
      ${ing}
    </div>
  </li>
  `;
      })
      .join('');
    return markup;
  }
}

export default new ShoppingList();
