let standingsTable = document.getElementById("wg-api-football-standings");

/*
Bloc de codi que controla el funcionament del "burger menú" mitjançant una classe "show" que s'afegeix
o s'elimina cada vegada que es fa clic sobre el botó del menú.
*/
const theBody = document.querySelector("body");
const openNav = document.querySelector(".menu-bar button");
const closeNav = document.querySelector(".close-nav button");
const Navbar = document.querySelector(".navbar");
function showHide() {
    Navbar.classList.toggle("show");
}
openNav.onclick = showHide;
closeNav.onclick = showHide;

//Funció que canvia el valor de l'atribut "data-league" del widget de la API a el valor de la lliga corresponent
function setPremierId() {
    standingsTable.setAttribute("data-league", "39");
    //Bloc de codi que "refresca" el contingut del widget un cop canviat un dels seus atributs
    window.document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true
    }));
}
function setLaligaId() {
    standingsTable.setAttribute("data-league", "140");

    window.document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true
    }));
}
function setSerieaId() {
    standingsTable.setAttribute("data-league", "135");

    window.document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true
    }));
}
function setBundesligaId() {
    standingsTable.setAttribute("data-league", "78");

    window.document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true
    }));
}
function setLigueId() {
    standingsTable.setAttribute("data-league", "61");

    window.document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true
    }));
}

//Afegeix la classe "selected" al primer botó, que és el que volem que etigui seleccionat per defecte
document.getElementById("premierBtn").classList.add("selected");
//Canviar el botó seleccionat per mostrar el "border" al botó que correspon.
$("button").on("click", function () {
    $("button").removeClass("selected");
    $(this).addClass("selected");
});