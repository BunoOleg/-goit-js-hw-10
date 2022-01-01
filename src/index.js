import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(e => {
    const inputValue = e.target.value.trim();

    if (inputValue === '') {
      countryList.innerHTML = '';
      return;
    }

    fetchCountries(inputValue)
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      })
      .then(list => {
        if (list.length > 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (list.length > 1) {
          renderCountryList(list);
        } else if (list.length == 1) {
          renderCountryInfo(list[0]);
        }
      });
  }, DEBOUNCE_DELAY),
);

function renderCountryList(list) {
  const markup = list
    .map(item => {
      return `<li>
            <img src="${item.flags.svg}"  width="50px" />
            ${item.name.official}
            </li>`;
    })
    .join('');
  countryInfo.innerHTML = '';
  countryList.innerHTML = markup;
}

function renderCountryInfo(item) {
  const markup = `
            <h1>
            <img src="${item.flags.svg}"  width="60px"/>
            ${item.name.official}
            </h1>
            <p><span>Capital<span>: ${item.capital}</p>
            <p><span>Population<span>: ${item.population}</p>
            <p><span>Languages<span>: ${Object.values(item.languages)}</p>
        `;
  countryList.innerHTML = '';
  countryInfo.innerHTML = markup;
}
