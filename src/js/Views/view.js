import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup is returned if render=false
   * @this {Object} View instance
   * @todo Finish implementation
   * @author Jonah Jackson
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // hides all html elements
  _hide() {
    const nodes = this._parentElement.childNodes;
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) node.classList.add('fullHide');
    });
  }

  // clears innerHTML of parent element
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // unhides all HTML elements and checks / deletes all temp elements (error & success messages, spinner, and user added ingredients)
  _reinstate() {
    const nodes = this._parentElement.childNodes;
    nodes.forEach(node => {
      // if node is an HTML element unhide
      if (node.nodeType === Node.ELEMENT_NODE) {
        node.classList.remove('fullHide');
        // if node is temp rendered element delete
        if (
          node.classList.contains('error') ||
          node.classList.contains('message') ||
          node.classList.contains('spinner')
        )
          node.remove();
        if (node.classList.contains('upload__ingredients--list')) {
          // if node is an ingredient delete
          node?.childNodes.forEach(node => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList.contains('user--ingredient')
            )
              node.remove();
          });
          // if node is the ingredient list hide
          node.classList.add('fullHide');
        }
        // if ingredients in modal, clear ingredients
        if (node.classList.contains('modal-content')) {
          node?.childNodes.forEach(node => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList.contains('shopping--list')
            )
              node.remove();
          });
        }
      }
    });
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (!curEl) return;
      // update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl?.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attribute =>
          curEl.setAttribute(attribute.name, attribute.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._hide();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._hide();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
    `;
    this._hide();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
