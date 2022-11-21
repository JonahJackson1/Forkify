import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
import bookmarksView from './Views/bookmarksView.js';
import addRecipeView from './Views/addRecipeView.js';
import deleteRecipeView from './Views/deleteRecipeView.js';
import ingredientView from './Views/ingredientView.js';
import editRecipeView from './Views/editRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // render loading icon
    resultsView.renderSpinner();
    // Load search results
    await model.loadSearchResults(query);
    // Render search results
    resultsView.render(model.getSearchResultsPage());
    // Render initial pagination btns
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  // if bookmarks render them to nav
  if (model.state.bookmarks.length < 0) return;
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  // Add or removes bookmark from nav
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  controlBookmarks();
};

// Adds ingredient to data list and to userIngredients array
const controlAddIngredient = function (
  newIngredient,
  error = null,
  data = null
) {
  try {
    if (error) throw error;
    model.createIngredient(newIngredient);
    ingredientView._renderIngredient(
      ingredientView._generateMarkup(model.state.userIngredients.slice(-1))
    );
  } catch (err) {
    ingredientView.renderError(err, data);
  }
};

// Edits a selected ingredient from the data list
const controlEditIngredient = function (arr) {
  try {
    const ingredient = model.getUserIngredient(arr);
    model.deleteIngredient(ingredient);
    ingredientView.addHandlerEditIngredient(null, true, ingredient);
  } catch (err) {
    ingredientView.renderError(err);
  }
};

// Removes an ingredient from the data list
const controlRemoveIngredient = function (arr) {
  try {
    const ingredient = model.getUserIngredient(arr);
    model.deleteIngredient(ingredient);
  } catch (err) {
    ingredientView.renderError(err);
  }
};

// Adds the recipe to the bookmarks, renders to UI, updates the URL, & updates the state
const controlAddRecipe = async function (newRecipe) {
  try {
    if (!model.checkUserIngredients())
      throw new Error('No ingredients were added.');

    // Spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    controlBookmarks();

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // remove success message
    setTimeout(function () {
      addRecipeView._reinstate();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
    setTimeout(function () {
      // remove error message
      addRecipeView._reinstate();
    }, MODAL_CLOSE_SEC * 1000);
  }
};

const controlEditRecipe = function () {
  // Clear Form
  addRecipeView._reinstate();

  // clear userIngredients
  model.state.userIngredients = [];

  // Toggles recipe window
  addRecipeView.toggleWindow();

  // For each ingedient in the model state, print to UI
  ingredientView._renderIngredient(
    ingredientView._generateMarkup(model.state.recipe.ingredients)
  );

  // push model ings to userIngredients arr
  model.state.recipe.ingredients.forEach(ingredient => {
    model.state.userIngredients.push(ingredient);
  });

  // Delete current recipe from model, api and bookmarks w/ hash (is not deleted from UI, didnt want to do any cancel functionality if close form w/o submit)
  controlDeleteRecipe(window.location.hash.substring(1), true);
};

const controlDeleteRecipe = async function (hash, edit = null) {
  // deletes recipe from API
  await model.deleteRecipe(hash);
  // Removes bookmark from Array
  model.removeBookmark(hash);
  // Removes bookmark from UI
  bookmarksView.update(model.state.bookmarks);
  controlBookmarks();
  // Changes URL Hash
  window.history.pushState(null, '', ' ');

  if (!edit) {
    // Renders success message to UI
    deleteRecipeView.generateMarkup();
  }
};

const controlRecipes = async function () {
  try {
    // Getting hash from URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render spinner to UI
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // Loading recipes
    await model.loadRecipe(id);

    // updating bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err.message);
  }
};

(() => {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmark);

  bookmarksView.addHandlerRender(controlBookmarks);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
  editRecipeView.addHandlerEdit(controlEditRecipe);
  deleteRecipeView.addHandlerDelete(controlDeleteRecipe);

  ingredientView.addHandlerCreateIngredient(controlAddIngredient);
  ingredientView.addHandlerEditIngredient(controlEditIngredient);
  ingredientView.addHandlerRemoveIngredient(controlRemoveIngredient);
})();
