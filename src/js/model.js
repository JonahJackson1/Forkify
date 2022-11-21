import {
  KEY,
  MODAL_CLOSE_SEC,
  API_URL,
  RESULTS_PER_PAGE,
  SEARCH_START_PAGE,
} from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  userIngredients: [],
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.query = query;
    state.search.results = data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = SEARCH_START_PAGE;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  if (!state.search.page) return;
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 9;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    // prettier-ignore
    ingredient.quantity = (ingredient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (id) {
  // removes bookmark from array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const deleteIngredient = function (ingredient) {
  state.userIngredients.forEach((ing, i) => {
    if (!ingredient === ing) return;
    state.userIngredients.splice(i, 1);
  });
};

export const getUserIngredient = function (arr) {
  const newObj = {
    quantity: +arr[0],
    unit: arr[1],
    description: arr[2],
  };
  const index = state.userIngredients.findIndex(el => {
    if (JSON.stringify(el) === JSON.stringify(newObj)) return el;
  });
  return state.userIngredients[index];
};

export const createIngredient = function (newIngredient) {
  const newIngredientObj = {
    quantity: +newIngredient.ingredientQuantity,
    unit: newIngredient.ingredientMeasurement,
    description: newIngredient.ingredientIngredient,
  };
  state.userIngredients.push(newIngredientObj);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: state.userIngredients,
    };
    if (recipe.ingredients.length === 0) {
      throw new Error('Please check form fields...');
    }
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err.message;
  }
};

export const checkUserIngredients = () =>
  state.userIngredients.length > 0 ? true : false;

export const deleteRecipe = async function (hash) {
  // this deletes the recipe from API
  try {
    await fetch(`${API_URL}/${hash}?key=${KEY}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    throw err;
  }
};

(() => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
})();
