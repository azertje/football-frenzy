/*
Bloc de codi que controla el funcionament del "burger menú" mitjançant una classe "show" que s'afegeix
o s'elimina cada vegada que es fa clic sobre el botó del menú.
*/
const theBody = document.querySelector("body");
const openNav = document.querySelector(".menu-bar button");
const closeNav = document.querySelector(".close-nav button");
const Navbar = document.querySelector(".navbar");

//Amagar continguts quan s'obre el burger menu
const main = document.querySelector("main");
const footer = document.querySelector("footer");
function showHide() {
    Navbar.classList.toggle("show");
    main.classList.toggle("display");
    footer.classList.toggle("display");
}
openNav.onclick = showHide;
closeNav.onclick = showHide;