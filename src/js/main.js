"use strict";

console.log(">> Ready :)");

/* Elementos que usamos en el HTML */

const listDrink = document.querySelector(".js-list");
const listDrinkFav = document.querySelector(".js-list-fav");
const inputName = document.querySelector(".js-input-name");
const searchButton = document.querySelector(".js-button-search");
const resetButton = document.querySelector(".js-button-reset");
const resetButtonFav = document.querySelector(".js-reset-fav");
const msgErrorSearch = document.querySelector(".js-msg-error");

let drinkDataList = [];
let favorites = [];

//FUNCIONES

// Añadimos la informacion al local storage
function setInLocalStorage() {
  // stringify me permite transformar a string el array de favoritos
  const stringFavorites = JSON.stringify(favorites);
  //añadimos  al localStorage  los datos convertidos en string previamente
  localStorage.setItem("favorites", stringFavorites);
}

/*Obtener listado de la busqueda*/
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
        // console.error(`Ha sucedido un error: ${error}`);
        msgErrorSearch.innerHTML = `Este cocktail no está en el listado`;
      });
  }
}

/*Pinta en el HTML el coctel buscado*/
function renderDrink(drinkData) {
  //Si el coctail (drinkData) no tiene foto se le asigna una por defecto
  if (drinkData.strDrinkThumb === null) {
    drinkData.strDrinkThumb = `https://via.placeholder.com/210x295/ffffff/666666/?text=drink`;
  }

  //Si el coctail (drinkData) esta en la lista favoritos se le añade la clase favorite
  const drinkFoundIndex = favorites.findIndex((fav) => {
    return fav.idDrink === drinkData.idDrink;
  });
  let classFav = "";
  if (drinkFoundIndex !== -1) {
    classFav = "favorite";
  }

  //Se pinta el coctail (drinkData)
  const drink = `<li class="lists__list--drink ${classFav} js-drink-item" id="${drinkData.idDrink}">  
  <img class="lists__list--img" src=${drinkData.strDrinkThumb} alt="Foto de ${drinkData.strDrink}" />
  <p class="lists__list--name">${drinkData.strDrink}</p>
 </li>`;

  return drink;
}

/*Pinta en el HTML la lista de los cócteles buscados*/
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

//Favoritos
//Pinta en el HTML el coctel FAVORITO
function renderDrinkFavorite(drinkDataFav) {
  if (drinkDataFav.strDrinkThumb === null) {
    drinkDataFav.strDrinkThumb = `https://via.placeholder.com/210x295/ffffff/666666/?text=drink`;
  }

  const drinkFav = `<li class="lists__list--fav js-drink-fav" id="${drinkDataFav.idDrink}"> 
  <img class="lists__list--img" src=${drinkDataFav.strDrinkThumb} alt="Foto de ${drinkDataFav.strDrink}" />
  <p class="lists__list--name">${drinkDataFav.strDrink}</p>
  <button class="btn-delete js-delete-fav" id="${drinkDataFav.idDrink}"><i class="icon fas fa-times"></i></button>
  </li>`;

  return drinkFav;
}

//Pinta en el HTML la lista de cocteles FAVORITOS
function renderDrinksFavoriteList(listFavorites) {
  console.log(listFavorites);

  listDrinkFav.innerHTML = "";
  for (const drinkItemFav of listFavorites) {
    listDrinkFav.innerHTML += renderDrinkFavorite(drinkItemFav);
  }

  if (listFavorites.length > 0) {
    //hay elementos en la lista de favoritos
    //Añade la clase hiddenn al "p"
    document.querySelector(".js-msg-fav").classList.add("hidden");
    resetButtonFav.classList.remove("hidden");
  } else {
    document.querySelector(".js-msg-fav").classList.remove("hidden");
    resetButtonFav.classList.add("hidden");
  }

  //Después recorrer la lista para escuchar el evento del boton delete
  const deleteFav = document.querySelectorAll(".js-delete-fav");
  for (const itemdrinkFav of deleteFav) {
    itemdrinkFav.addEventListener("click", handleClicDeleteFav);
  }

  // los datos que me ha dado la API  los guardamos en el loscalStorage
  setInLocalStorage();
}

function handleClicDrink(event) {
  event.preventDefault();

  //Obtener a que drink le hago clic
  const liDrink = event.currentTarget;
  console.log(`Este es el id seleccionado: ${liDrink.id}`);

  //compruebo si el cóctel que recibo está en los favoritos
  const drinkFoundIndex = favorites.findIndex((fav) => {
    return fav.idDrink === liDrink.id;
  });

  console.log(`drinkFoundIndex:${drinkFoundIndex}`);
  if (drinkFoundIndex !== -1) {
    //EXISTE EN FAVORITOS

    //Borrar del array de favoritos
    favorites.splice(drinkFoundIndex, 1);
    //Eliminar clase favorito al coctail de la búsqueda
    liDrink.classList.remove("favorite");
  } else {
    //NO EXISTE EN FAVORITOS
    const newDrink = drinkDataList.find((fav) => {
      return fav.idDrink === liDrink.id;
    });
    //Añadir al array de favoritos
    favorites.push(newDrink);
    //Añadir clase favorito al coctail de la búsqueda
    liDrink.classList.add("favorite");
  }
  console.log(`list favorito:${favorites}`);

  //Pintar el array de favoritos en el html
  renderDrinksFavoriteList(favorites);
}

//Elimina el coctel de la lista de favorios
function handleClicDeleteFav(event) {
  event.preventDefault();
  const liDrinkFav = event.currentTarget;

  const drinkFoundIndex = favorites.findIndex((fav) => {
    return fav.idDrink === liDrinkFav.id;
  });

  favorites.splice(drinkFoundIndex, 1);

  renderDrinksList(drinkDataList);
  renderDrinksFavoriteList(favorites);
}

/*Borrar los campos y los datos de la lista de cocteles*/
function handleReset(event) {
  event.preventDefault();
  drinkDataList = [];
  listDrink.innerHTML = "";
  msgErrorSearch.innerHTML = "";
  inputName.value = "";
}

/*Borrar el listado completo de favoritos*/

function ResetListFav(event) {
  event.preventDefault();
  favorites.splice(0);

  renderDrinksList(drinkDataList);
  renderDrinksFavoriteList(favorites);
}

//EVENTOS
searchButton.addEventListener("click", getDrinks);
resetButton.addEventListener("click", handleReset);
resetButtonFav.addEventListener("click", ResetListFav);

//LOCAL STORAGE

// esta función  nos permite buscar en el localStorage si hay información guardada
// para no hacer petición al servidor cada vez que cargue la página
function getLocalStorage() {
  // obtenermos lo que hay en el LS
  const localStorageFavorites = localStorage.getItem("favorites");
  // siempre que cojo datos del local storage tengo que comprobar si son válidos
  // es decir si es la primera vez que entro en la página
  if (localStorageFavorites === null) {
    // no tengo datos en el local storage, así que llamo al API
    getDrinks();
  } else {
    // sí tengo datos en el local storage, así lo parseo a un array y
    const arrayFavorites = JSON.parse(localStorageFavorites);
    // lo guardo en la variable global de favorites
    favorites = arrayFavorites;
    // cada vez que modifico los arrays del listado o de favorites vuelvo a pintar y a escuchar eventos
    renderDrinksList(drinkDataList);
    renderDrinksFavoriteList(favorites);
  }
}
// 1- start app -- Cuando carga la pagina
getLocalStorage();
