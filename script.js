'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
                    <article class="country ${className}">
                    <img class="country__img" src="${data.flags.png}" />
                    <div class="country__data">
                        <h3 class="country__name">${data.name.official}</h3>
                        <h4 class="country__region">${data.region}</h4>
                        <p class="country__row"><span>👫</span>${(
                          +data.population / 1_000_000
                        ).toFixed(1)} million people</p>
                        <p class="country__row"><span>🗣️</span>${Object.values(
                          data.languages
                        ).join(', ')}</p>
                        <p class="country__row"><span>💰</span>${
                          Object.values(data.currencies)[0].name
                        }</p>
                    </div>
                    </article>
                  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

// 256. Coding Challenge #1

function getJSON(url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
}

function pullCountry(country) {
  getJSON(
    `https://restcountries.com/v3.1/name/${country}`,
    'Country not found:'
  )
    .then(data => {
      renderCountry(data[0]);
      const neighbor = data[0].borders[0];
      if (!neighbor) {
        throw new Error('No neighbor found!');
      }

      //   Country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbor}`,
        'Country not found:'
      );
    })
    .then(data => {
      renderCountry(data[0], 'neighbor');
    })
    .catch(err => {
      console.error(`${err} 👨‍🦯`);
      renderError(`Something went wrong... ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
}

function renderGeo(data) {
  console.log(`You are in ${data.state}, ${data.country}`);
}

function whereAmI(lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data?.success === false) throw new Error(`${data.error.message}`);
      renderGeo(data);
      pullCountry(data.country);
    })
    .catch(err => {
      console.error(`${err} 👨‍🦯`);
    });
}
whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
