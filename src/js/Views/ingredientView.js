import View from './view.js';
import icons from 'url:../../img/icons.svg';

class IngredientView extends View {
  _container = document.querySelector('.upload');
  _parentElement = document.querySelector('.upload__ingredients--list');
  _recipeDataContainer = document.querySelector('.recipe__data');
  _ingredientListContainer = document.querySelector(
    '.upload__ingredients--list'
  );
  addHandlerCreateIngredient(handler) {
    this._container.addEventListener(
      'click',
      function (e) {
        let errorData;
        try {
          this.toggleUploadWindows(e);
          if (!e.target.classList.contains('add__ingredient--btn')) return;
          const dataArray = [...new FormData(this._container)].filter(el => {
            if (el[0].startsWith('ingredient') && !el[1]) {
              errorData = el;
              throw new Error('Please check entry and try again...');
            }
            if (el[0].startsWith('ingredient') && el[1]) return el;
          });
          const data = Object.fromEntries(dataArray);
          handler(data);
          document.querySelector('.type--quantity').value = '';
          document.querySelector('.type--measurement').value = '';
          document.querySelector('.type--ingredient').value = '';
        } catch (errMsg) {
          handler(null, errMsg, errorData);
        }
      }.bind(this)
    );
  }
  addHandlerEditIngredient(handler, callback = false, data) {
    try {
      if (callback === false) {
        this._parentElement.addEventListener('click', async function (e) {
          if (!e.target.classList.contains('btn__edit')) return;

          const nodeList = document.querySelectorAll('.user--ingredient');
          nodeList.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              node.childNodes.forEach(element => {
                if (
                  element.nodeType === element.ELEMENT_NODE &&
                  e.target.previousElementSibling === element
                ) {
                  console.log(Array.from(element.textContent.split(' ')));
                  handler(Array.from(element.textContent.split(' ')));
                }
              });
            }
          });
          e.target.parentNode.remove();
        });
      }
      if (callback === true) {
        document.querySelector('.type--quantity').value = data.quantity;
        document.querySelector('.type--measurement').value = data.unit;
        document.querySelector('.type--ingredient').value = data.description;
      }
    } catch (err) {
      throw err;
    }
  }

  addHandlerRemoveIngredient(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (!e.target.classList.contains('btn__remove')) return;
      const nodeList = document.querySelectorAll('.user--ingredient');
      nodeList.forEach(node => {
        node.childNodes.forEach(element => {
          if (element.nodeType === element.ELEMENT_NODE) {
            if (!element.classList.contains('user--ingredient-created')) return;
            handler(Array.from(element.textContent.split(' ')));
          }
        });
      });
      e.target.parentNode.remove();
    });
  }

  renderError(err, data = null) {
    if (data) {
      const nodeList = document.getElementsByName(`${data[0]}`);
      this._parentElement = nodeList[0];
      this._parentElement.placeholder = err.message;
      this._parentElement = document.querySelector(
        '.upload__ingredients--list'
      );
      return;
    }

    let n = 0;
    const markup = `
    <div class="error error--${n}">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${err.message}</p>
          </div>
    `;
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  toggleUploadWindows(e, error = null) {
    const hideRecipeData = () => {
      this._recipeDataContainer.classList.add('fullHide');
      this._ingredientListContainer.classList.remove('fullHide');
    };
    const hideIngredientList = () => {
      this._recipeDataContainer.classList.remove('fullHide');
      this._ingredientListContainer.classList.add('fullHide');
    };
    if (error === true) {
      hideRecipeData();
      return;
    }
    if (e.target.classList.contains('add__ingredient--btn')) hideRecipeData();
    if (e.target.classList.contains('btn__recipe-data--list')) hideRecipeData();
    if (e.target.classList.contains('btn__list--close')) hideIngredientList();
  }
  _generateMarkup(ingredient) {
    this._data = ingredient;
    return this._data
      .map(
        ingredient => `
          <div class="user--ingredient">
          <label class="user--ingredient-created">${ingredient.quantity} ${ingredient.unit} ${ingredient.description}</label>
          <button type="button" class="btn__ingredient btn__edit">Edit</button>
          <button type="button" class="btn__ingredient btn__remove">Remove</button>
          </div>
        `
      )
      .join('');
  }
  _renderIngredient(markup) {
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
}

export default new IngredientView();
