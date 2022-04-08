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

    console.log(`serverurl: ${SERVER_URL}`);

    fetch(SERVER_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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

  const drink = `<li class="drink js-drink-item" id="${drinkData.idDrink}">
  
  <img class="drink__img" src=${drinkData.strDrinkThumb} alt="Foto de ${drinkData.strDrink}" />
  <p class="drink__descripcion">${drinkData.strDrink}</p>
 </li>`;

  return drink;
}

//Pinta en el HTML la lista con todos los item de coctel buscado

function renderDrinksList(drinkList) {
  listDrink.innerHTML = "";
  console.log(drinkList);
  for (const drinkItem of drinkList) {
    listDrink.innerHTML += renderDrink(drinkItem);
  }

  const liDrink = document.querySelectorAll(".js-drink-item");
  for (const itemdrink of liDrink) {
    itemdrink.addEventListener("click", handleClicDrink);
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

//Favoritos

//Pinta en el HTML cada item de coctel FAVORITOS
function renderDrinkFavorite(drinkDataFav) {
  if (drinkDataFav.strDrinkThumb === null) {
    drinkDataFav.strDrinkThumb = `https://via.placeholder.com/210x295/ffffff/666666/?text=drink`;
  }

  const drinkFav = `<li class="drink__fav js-drink-item" id="${drinkDataFav.idDrink}"> 
  <img class="drink__img" src=${drinkDataFav.strDrinkThumb} alt="Foto de ${drinkDataFav.strDrink}" />
  <p class="drink__descripcion">${drinkDataFav.strDrink}</p>
  <i class="drink__delete fa-solid fa-circle-xmark js-delete-fav"></i>
 </li>`;

  return drinkFav;
}

//Pinta en el HTML la lista  FAVORITOS

function renderDrinksFavoriteList(listFavorites) {
  console.log(listFavorites);

  listDrinkFav.innerHTML = "";
  for (const drinkItemFav of listFavorites) {
    listDrinkFav.innerHTML += renderDrinkFavorite(drinkItemFav);
  }

  //Después recorrer la lista para escuchar el evento del delete
}

/*
1.Crear el listado de favoritos
2.Escuchar cuando clico listado un itemDrink
3.Obtener a que itemDrink le ha clicado (identificador)
4.Comprobar si exite en el listado de favoritos con el identificador : 
  * SI EXITE:
     - Eliminar del listado de favoritos
     - Quitar la clase de "favorito" en la lista
     - Volver a pintar el html
  * NO EXITE: 
    - Añadir al listado de favoritos
    - Añadir la clase de "favorito" en la lista
    - Volver a pintar el html
*/

function handleClicDrink(event) {
  event.preventDefault();
  //Obtener a que drink le hago clic
  const liDrink = event.currentTarget;
  console.log(`Este es el id seleccionado: ${liDrink.id}`);

  //compruebo si el drink que recibo por parámetro está en los favoritos
  const drinkFoundIndex = favorites.findIndex((fav) => {
    return fav.idDrink === liDrink.id;
  });

  console.log(`drinkFoundIndex:${drinkFoundIndex}`);

  if (drinkFoundIndex !== -1) {
    //EXISTE EN FAVORITOS
    //Borrar
    favorites.splice(drinkFoundIndex, 1);
    //Eliminar clase favorito
    liDrink.classList.remove("favorite");
  } else {
    //NO EXISTE EN FAVORITOS
    console.log("No está");

    const newDrink = drinkDataList.find((fav) => {
      return fav.idDrink === liDrink.id;
    });
    favorites.push(newDrink);
    //Añadir clase favorito
    liDrink.classList.add("favorite");
  }
  console.log(`list favorito:${favorites}`);
  //Pintar el array de favoritos en el html
  renderDrinksFavoriteList(favorites);
}

//Eventos
searchButton.addEventListener("click", getDrinks);
resetButton.addEventListener("click", handleReset);
