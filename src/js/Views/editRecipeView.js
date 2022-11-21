import View from './view.js';

export class EditRecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  addHandlerEdit(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (!e.target.classList.contains('edit--recipe')) return;
      handler();
    });
  }
}

export default new EditRecipeView();
