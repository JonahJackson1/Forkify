import View from './view.js';

class AddIngredientView extends View {
  _parentElement = document.querySelector('.add__ingredient');
  btnAddIngredient = document.querySelector('.add__ingredient--btn');
  constructor() {
    super();
  }

  addHandlerIngredient(handler) {
    // console.log(this.btnAddIngredient);
    this.btnAddIngredient.addEventListener('click', function (e) {
      console.log(this);
      console.log('apple');
      // const data = Object.fromEntries(dataArray);
      handler();
    });
  }
  _generateMarkup(newIngredient) {
    return `
    <label>${newIngredient.quantity} ${newIngredient.measurement} ${newIngredient.ingredient}</label>
    <button type="button" class="btn__ingredient btn__edit">Edit</button>
    <button type="button" class="btn__ingredient btn__remove">Remove</button>
    `;
  }
}

export default new AddIngredientView();
