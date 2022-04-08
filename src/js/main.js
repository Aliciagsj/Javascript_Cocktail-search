"use strict";

console.log(">> Ready :)");

/* Elementos que usamos en el HTML */

const drinksContainer = document.querySelector(".js-list-drinks");
const drinksfavContainer = document.querySelector(".js-list-favdrinks");

const listDrink = document.querySelector(".js-list");
const listDrinkFav = document.querySelector(".js-list-fav");

const inputName = document.querySelector(".js-input-name");
const searchButton = document.querySelector(".js-button-search");
const resetButton = document.querySelector(".js-button-reset");

const msgErrorSearch = document.querySelector(".js-msg-error");

const drinksListStored = JSON.parse(localStorage.getItem("drinksList"));

let drinkDataList = [];
let favorites = [];
//Funciones

//Obtener listado de cocteles seleccionadas por el usuario
function getDrinks(event) {
  event.preventDefault();

  drinkDataList = [];
  listDrink.innerHTML = "";
  msgErrorSearch.innerHTML = "";

  if (inputName.value === "") {
    msgErrorSearch.innerHTML = `Debe rellenar el buscador`;
  } else {
    const SERVER_URL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputName.value}`;

    fetch(SERVER_URL)
      .then((response) => response.json())
      .then((data) => {
        drinkDataList = data.drinks;
        renderDrinksList(drinkDataList);
      })
      .catch((error) => {
        console.error(`Ha sucedido un error: ${error}`);
      });
  }
}

//Pinta en el HTML cada item de coctel buscado
function renderDrink(drinkData) {
  if (drinkData.strDrinkThumb === null) {
    drinkData.strDrinkThumb = `https://via.placeholder.com/210x295/ffffff/666666/?text=drink`;
  }

  const drink = `<li>
  <article class="drink js-drink-item">
  <img class="drink_img" src=${drinkData.strDrinkThumb} alt="Foto de ${drinkData.strDrink}" />
  <p class="drink_descripcion">${drinkData.strDrink}</p>
  </article></li>`;

  return drink;
}

//Pinta en el HTML la lista con todos los item de coctel buscado

function renderDrinksList(DrinksDataList) {
  listDrink.innerHTML = "";
  for (const drinkItem of DrinksDataList) {
    listDrink.innerHTML += renderDrink(drinkItem);
  }
}

//Borrar los campos y los datos de la lista de cocteles
function handleReset(event) {
  event.preventDefault();
  drinkDataList = [];
  listDrink.innerHTML = "";
  msgErrorSearch.innerHTML = "";
  inputName.value = "";
}

searchButton.addEventListener("click", getDrinks);
resetButton.addEventListener("click", handleReset);

/*

//Filtrar por nombre
function filterDrink(event) {
  event.preventDefault();
  const nameSearchText = inputName.value;
  listDrink.innerHTML = "";
  const dataDrinkFiltered = drinkDataList.filter((drink) =>
    drink.strDrink.includes(nameSearchText)
  );
  renderDrinksList(dataDrinkFiltered);
}

//Eventos
searchButton.addEventListener("click", filterDrink);
*/
