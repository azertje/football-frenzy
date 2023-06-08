/*
 ! Per a la correcció de la PRA, si en una data no hi han partits, canviar manualment la URl del
 ! mètode "fetch" a una altra data. 
 ! Exemple: https://v3.football.api-sports.io/fixtures?date=2023-05-17&league=140&season=2022
*/ 

var eplTable = document.querySelector("#eplTable");
var laligaTable = document.querySelector("#laligaTable");
var serieaTable = document.querySelector("#serieaTable");
var bundesligaTable = document.querySelector("#bundesligaTable");
var ligueTable = document.querySelector("#ligueTable");
var scoreBtn1 = document.getElementById("scoreBtn1"); 
var scoreBtn2 = document.getElementById("scoreBtn2"); 
var scoreBtn3 = document.getElementById("scoreBtn3"); 
var scoreBtn4 = document.getElementById("scoreBtn4"); 
var scoreBtn5 = document.getElementById("scoreBtn5"); 
var scoreBtn6 = document.getElementById("scoreBtn6"); 
var scoreBtn7 = document.getElementById("scoreBtn7"); 

/*
    Codi per aconseguir la data actual, la guardem en variables "day" per el dia, "month" per el mes
    i "year" per l'any. La variable "dateString" conté la data completa en format YY-MM-DD
*/
var todaydate = new Date();
var day = todaydate.getDate();
var month = todaydate.getMonth() + 1;
//Si el número de mes és d'una xifra, afegirm un 0 davant per complir amb el format de la data
if (month < 10) {
    month = "0"+ month;
}
var year = todaydate.getFullYear();
var dateString = year + "-" + month + "-" + day;

//Text dels botons per canviar de data
scoreBtn1.innerHTML = day - 3 + "/" + month;
scoreBtn2.innerHTML = day - 2 + "/" + month;
scoreBtn3.innerHTML = day - 1 + "/" + month;
scoreBtn4.innerHTML = day + "/" + month;
scoreBtn5.innerHTML = day + 1 + "/" + month;
scoreBtn6.innerHTML = day + 2 + "/" + month;
scoreBtn7.innerHTML = day + 3 + "/" + month;

//Funció per aconseguir les dades de la Premier League i mostar-les al DOM
function eplFetch(fetchDate) {
    //Creació de l'element que conté el nom de la lliga
    var eplTitle = document.createElement("h3");
    eplTitle.innerHTML = "Premier League";
    eplTable.appendChild(eplTitle);

    /*
    Mètode fetch que obté les dades demanades segons els paràmetres de la URL: La data, l'ID de 
    la lliga, i la temporada que volem obtenir.
    */
    fetch(
        `https://v3.football.api-sports.io/fixtures?date=2023-05-20&league=39&season=2022`,
        {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "bd2f5b92aa740dde6547b6a107374ab3",
            },
        }
    )
        .then((response) =>
            response.json().then((data) => {
                var matchesList = data["response"]; //creació d'un array que conté cada resultat del fetch
                console.log(matchesList.length);
                console.log(data);

                //Si no hi ha partits per la lliga i data seleccionats, no es mostra el títol
                if (matchesList.length < 1) {
                    eplTitle.style.display = "none";
                }

                //Ordenar l'array de la llista de partits de forma ascendent mitjançant el paràmetre "timestamp"
                matchesList.sort((a, b) => a["fixture"]["timestamp"]-b["fixture"]["timestamp"]);

                //Per cada resultat trobat, es crida el mètode addMatchTile() per crear els elements 
                //necessaris per  mostrar al DOM els resultats
                for (var i = 0; i < matchesList.length; i++) {
                    addMatchTile(matchesList[i]);
                }
            })
        )
        .catch((err) => {
            console.log(err);
        });

    //Funció per crear els elements necessaris per a cada partit obtingut al "fetch"
    function addMatchTile(data) {
        //Creació del "div" del partit
        var matchtile = document.createElement("div");
        matchtile.classList.add("match-tile");

        //Creació i configuració del temps del partit
        var tiletime = document.createElement("p");
        
        /*
            Bloc que controla el text que es mostra referent al temps del partit.
            Si el partit no ha començat, es mostra l'hora de començament en format UTC+2.
            Si el partit està en joc, es mostra el minut actual del partit.
            Si ha acabat, es mostra FT (Full Time).
        */
        if (data["fixture"]["status"]["elapsed"] == null) {
            var fixtureTimeString = data["fixture"]["date"];
            //Guardem les 5 primeres xifres, que corresponen a la hora i els minuts (HH:mm)
            var fixtureTime = (fixtureTimeString.split('T').pop()).substring(0,5);
            //Sumem 2 al valor de la hora per passar-la a la zona horària local (UTC+2)
            var fixtAdder = Number(fixtureTime.substring(0,2))+2;
            var fixtureTimeFinal = fixtAdder + ":" + (fixtureTimeString.split('T').pop()).substring(3,5)
            tiletime.innerHTML = fixtureTimeFinal;
        }else if (data["fixture"]["status"]["elapsed"] > 89) {
            //Si el minut del partit és 90, mostra FT (Full Time), sino, mostra el minut del partit
            tiletime.innerHTML = data["fixture"]["status"]["short"];
        }else {
            tiletime.innerHTML = data["fixture"]["status"]["elapsed"] + "'";
        }

        //Div de l'equip local
        var homeTeam = document.createElement("div");
        homeTeam.classList.add("team");
        //Assignant l'escut i el nom de l'equip visitant
        var homeTileTeamName = document.createElement("p");
        homeTileTeamName.innerHTML = data["teams"]["home"]["name"];
        var homeTileTeamLogo = document.createElement("img");
        homeTileTeamLogo.src = data["teams"]["home"]["logo"];
        homeTeam.appendChild(homeTileTeamLogo);
        homeTeam.appendChild(homeTileTeamName);

        //Div de l'equip visitant
        var awayTeam = document.createElement("div");
        awayTeam.classList.add("team");
        //Assignant l'escut i el nom de l'equip visitant
        var awayTileTeamName = document.createElement("p");
        awayTileTeamName.innerHTML = data["teams"]["away"]["name"];
        var awayTileTeamLogo = document.createElement("img");
        awayTileTeamLogo.src = data["teams"]["away"]["logo"];
        awayTeam.appendChild(awayTileTeamLogo);
        awayTeam.appendChild(awayTileTeamName);

        //Assignant el resultat de gols del partit
        var score = document.createElement("p");
        score.innerHTML = data["goals"]["home"] + " - " + data["goals"]["away"];
        if (data["goals"]["home"] == null && data["goals"]["away"] == null) {
            score.innerHTML = " - ";
        }

        //Afegint els elements al parent.
        matchtile.appendChild(tiletime);
        matchtile.appendChild(homeTeam);
        matchtile.appendChild(score);
        matchtile.appendChild(awayTeam);
        eplTable.appendChild(matchtile);
    }
}

function laligaFetch(fetchDate) {
    var laligaTitle = document.createElement("h3");
    laligaTitle.innerHTML = "La Liga";
    laligaTable.appendChild(laligaTitle);

    fetch(
        `https://v3.football.api-sports.io/fixtures?date=2023-05-20&league=140&season=2022`,
        {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "bd2f5b92aa740dde6547b6a107374ab3",
            },
        }
    )
        .then((response) =>
            response.json().then((data) => {
                var matchesList = data["response"];
                console.log(matchesList.length);
                console.log(data);
                
                if (matchesList.length < 1) {
                    laligaTitle.style.display = "none";
                }

                //Ordenar l'array de la llista de partits de forma ascendent mitjançant el paràmetre "timestamp"
                matchesList.sort((a, b) => a["fixture"]["timestamp"]-b["fixture"]["timestamp"]);

                for (var i = 0; i < matchesList.length; i++) {
                    addMatchTile(matchesList[i]);
                }
            })
        )
        .catch((err) => {
            console.log(err);
        });

    function addMatchTile(data) {
        var matchtile = document.createElement("div");
        matchtile.classList.add("match-tile");

        var tiletime = document.createElement("p");
        
        if (data["fixture"]["status"]["elapsed"] == null) {
            var fixtureTimeString = data["fixture"]["date"];
            var fixtureTime = (fixtureTimeString.split('T').pop()).substring(0,5);
            var fixtAdder = Number(fixtureTime.substring(0,2))+2;
            var fixtureTimeFinal = fixtAdder + ":" + (fixtureTimeString.split('T').pop()).substring(3,5)
            tiletime.innerHTML = fixtureTimeFinal;
        }else if (data["fixture"]["status"]["elapsed"] > 89) {
            tiletime.innerHTML = data["fixture"]["status"]["short"];
        }else {
            tiletime.innerHTML = data["fixture"]["status"]["elapsed"] + "'";
        }
        
        var homeTeam = document.createElement("div");
        homeTeam.classList.add("team");
        var homeTileTeamName = document.createElement("p");
        homeTileTeamName.innerHTML = data["teams"]["home"]["name"];
        var homeTileTeamLogo = document.createElement("img");
        homeTileTeamLogo.src = data["teams"]["home"]["logo"];
        homeTeam.appendChild(homeTileTeamLogo);
        homeTeam.appendChild(homeTileTeamName);

        var awayTeam = document.createElement("div");
        awayTeam.classList.add("team");
        var awayTileTeamName = document.createElement("p");
        awayTileTeamName.innerHTML = data["teams"]["away"]["name"];
        var awayTileTeamLogo = document.createElement("img");
        awayTileTeamLogo.src = data["teams"]["away"]["logo"];
        awayTeam.appendChild(awayTileTeamLogo);
        awayTeam.appendChild(awayTileTeamName);

        var score = document.createElement("p");
        score.innerHTML = data["goals"]["home"] + " - " + data["goals"]["away"];
        if (data["goals"]["home"] == null && data["goals"]["away"] == null) {
            score.innerHTML = " - ";
        }

        matchtile.appendChild(tiletime);
        matchtile.appendChild(homeTeam);
        matchtile.appendChild(score);
        matchtile.appendChild(awayTeam);
        laligaTable.appendChild(matchtile);
    }
}

function serieaFetch(fetchDate) {
    var serieaTitle = document.createElement("h3");
    serieaTitle.innerHTML = "Serie A";
    serieaTable.appendChild(serieaTitle);

    fetch(
        `https://v3.football.api-sports.io/fixtures?date=2023-05-20&league=135&season=2022`,
        {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "bd2f5b92aa740dde6547b6a107374ab3",
            },
        }
    )
        .then((response) =>
            response.json().then((data) => {
                var matchesList = data["response"];
                console.log(matchesList.length);
                console.log(data);
                
                if (matchesList.length < 1) {
                    serieaTitle.style.display = "none";
                }

                //Ordenar l'array de la llista de partits de forma ascendent mitjançant el paràmetre "timestamp"
                matchesList.sort((a, b) => a["fixture"]["timestamp"]-b["fixture"]["timestamp"]);

                for (var i = 0; i < matchesList.length; i++) {
                    addMatchTile(matchesList[i]);
                }
            })
        )
        .catch((err) => {
            console.log(err);
        });

    function addMatchTile(data) {
        var matchtile = document.createElement("div");
        matchtile.classList.add("match-tile");

        var tiletime = document.createElement("p");
        
        if (data["fixture"]["status"]["elapsed"] == null) {
            var fixtureTimeString = data["fixture"]["date"];
            var fixtureTime = (fixtureTimeString.split('T').pop()).substring(0,5);
            var fixtAdder = Number(fixtureTime.substring(0,2))+2;
            var fixtureTimeFinal = fixtAdder + ":" + (fixtureTimeString.split('T').pop()).substring(3,5)
            tiletime.innerHTML = fixtureTimeFinal;
        }else if (data["fixture"]["status"]["elapsed"] > 89) {
            tiletime.innerHTML = data["fixture"]["status"]["short"];
        }else {
            tiletime.innerHTML = data["fixture"]["status"]["elapsed"] + "'";
        }

        var homeTeam = document.createElement("div");
        homeTeam.classList.add("team");
        var homeTileTeamName = document.createElement("p");
        homeTileTeamName.innerHTML = data["teams"]["home"]["name"];
        var homeTileTeamLogo = document.createElement("img");
        homeTileTeamLogo.src = data["teams"]["home"]["logo"];
        homeTeam.appendChild(homeTileTeamLogo);
        homeTeam.appendChild(homeTileTeamName);

        var awayTeam = document.createElement("div");
        awayTeam.classList.add("team");
        var awayTileTeamName = document.createElement("p");
        awayTileTeamName.innerHTML = data["teams"]["away"]["name"];
        var awayTileTeamLogo = document.createElement("img");
        awayTileTeamLogo.src = data["teams"]["away"]["logo"];
        awayTeam.appendChild(awayTileTeamLogo);
        awayTeam.appendChild(awayTileTeamName);

        var score = document.createElement("p");
        score.innerHTML = data["goals"]["home"] + " - " + data["goals"]["away"];
        if (data["goals"]["home"] == null && data["goals"]["away"] == null) {
            score.innerHTML = " - ";
        }

        matchtile.appendChild(tiletime);
        matchtile.appendChild(homeTeam);
        matchtile.appendChild(score);
        matchtile.appendChild(awayTeam);
        serieaTable.appendChild(matchtile);
    }
}

function bundesligaFetch(fetchDate) {
    var bundesligaTitle = document.createElement("h3");
    bundesligaTitle.innerHTML = "Bundesliga";
    bundesligaTable.appendChild(bundesligaTitle);

    fetch(
        `https://v3.football.api-sports.io/fixtures?date=2023-05-20&league=78&season=2022`,
        {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "bd2f5b92aa740dde6547b6a107374ab3",
            },
        }
    )
        .then((response) =>
            response.json().then((data) => {
                var matchesList = data["response"];
                console.log(matchesList.length);
                console.log(data);
                
                if (matchesList.length < 1) {
                    bundesligaTitle.style.display = "none";
                }

                //Ordenar l'array de la llista de partits de forma ascendent mitjançant el paràmetre "timestamp"
                matchesList.sort((a, b) => a["fixture"]["timestamp"]-b["fixture"]["timestamp"]);

                for (var i = 0; i < matchesList.length; i++) {
                    addMatchTile(matchesList[i]);
                }
            })
        )
        .catch((err) => {
            console.log(err);
        });

    function addMatchTile(data) {
        var matchtile = document.createElement("div");
        matchtile.classList.add("match-tile");

        var tiletime = document.createElement("p");
        
        if (data["fixture"]["status"]["elapsed"] == null) {
            var fixtureTimeString = data["fixture"]["date"];
            var fixtureTime = (fixtureTimeString.split('T').pop()).substring(0,5);
            var fixtAdder = Number(fixtureTime.substring(0,2))+2;
            var fixtureTimeFinal = fixtAdder + ":" + (fixtureTimeString.split('T').pop()).substring(3,5)
            tiletime.innerHTML = fixtureTimeFinal;
        }else if (data["fixture"]["status"]["elapsed"] > 89) {
            tiletime.innerHTML = data["fixture"]["status"]["short"];
        }else {
            tiletime.innerHTML = data["fixture"]["status"]["elapsed"] + "'";
        }

        var homeTeam = document.createElement("div");
        homeTeam.classList.add("team");
        var homeTileTeamName = document.createElement("p");
        homeTileTeamName.innerHTML = data["teams"]["home"]["name"];
        var homeTileTeamLogo = document.createElement("img");
        homeTileTeamLogo.src = data["teams"]["home"]["logo"];
        homeTeam.appendChild(homeTileTeamLogo);
        homeTeam.appendChild(homeTileTeamName);

        var awayTeam = document.createElement("div");
        awayTeam.classList.add("team");
        var awayTileTeamName = document.createElement("p");
        awayTileTeamName.innerHTML = data["teams"]["away"]["name"];
        var awayTileTeamLogo = document.createElement("img");
        awayTileTeamLogo.src = data["teams"]["away"]["logo"];
        awayTeam.appendChild(awayTileTeamLogo);
        awayTeam.appendChild(awayTileTeamName);

        var score = document.createElement("p");
        score.innerHTML = data["goals"]["home"] + " - " + data["goals"]["away"];
        if (data["goals"]["home"] == null && data["goals"]["away"] == null) {
            score.innerHTML = " - ";
        }

        matchtile.appendChild(tiletime);
        matchtile.appendChild(homeTeam);
        matchtile.appendChild(score);
        matchtile.appendChild(awayTeam);
        bundesligaTable.appendChild(matchtile);
    }
}

function ligueFetch(fetchDate) {
    var ligueTitle = document.createElement("h3");
    ligueTitle.innerHTML = "Ligue 1";
    ligueTable.appendChild(ligueTitle);

    fetch(
        `https://v3.football.api-sports.io/fixtures?date=2023-05-20&league=61&season=2022`,
        {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "bd2f5b92aa740dde6547b6a107374ab3",
            },
        }
    )
        .then((response) =>
            response.json().then((data) => {
                var matchesList = data["response"];
                console.log(matchesList.length);
                console.log(data);
                
                if (matchesList.length < 1) {
                    ligueTitle.style.display = "none";
                }

                //Ordenar l'array de la llista de partits de forma ascendent mitjançant el paràmetre "timestamp"
                matchesList.sort((a, b) => a["fixture"]["timestamp"]-b["fixture"]["timestamp"]);

                for (var i = 0; i < matchesList.length; i++) {
                    addMatchTile(matchesList[i]);
                }
            })
        )
        .catch((err) => {
            console.log(err);
        });

    function addMatchTile(data) {
        var matchtile = document.createElement("div");
        matchtile.classList.add("match-tile");

        var tiletime = document.createElement("p");
        
        if (data["fixture"]["status"]["elapsed"] == null) {
            var fixtureTimeString = data["fixture"]["date"];
            var fixtureTime = (fixtureTimeString.split('T').pop()).substring(0,5);
            var fixtAdder = Number(fixtureTime.substring(0,2))+2;
            var fixtureTimeFinal = fixtAdder + ":" + (fixtureTimeString.split('T').pop()).substring(3,5)
            tiletime.innerHTML = fixtureTimeFinal;
        }else if (data["fixture"]["status"]["elapsed"] > 89) {
            tiletime.innerHTML = data["fixture"]["status"]["short"];
        }else {
            tiletime.innerHTML = data["fixture"]["status"]["elapsed"] + "'";
        }

        var homeTeam = document.createElement("div");
        homeTeam.classList.add("team");
        var homeTileTeamName = document.createElement("p");
        homeTileTeamName.innerHTML = data["teams"]["home"]["name"];
        var homeTileTeamLogo = document.createElement("img");
        homeTileTeamLogo.src = data["teams"]["home"]["logo"];
        homeTeam.appendChild(homeTileTeamLogo);
        homeTeam.appendChild(homeTileTeamName);

        var awayTeam = document.createElement("div");
        awayTeam.classList.add("team");
        var awayTileTeamName = document.createElement("p");
        awayTileTeamName.innerHTML = data["teams"]["away"]["name"];
        var awayTileTeamLogo = document.createElement("img");
        awayTileTeamLogo.src = data["teams"]["away"]["logo"];
        awayTeam.appendChild(awayTileTeamLogo);
        awayTeam.appendChild(awayTileTeamName);

        var score = document.createElement("p");
        score.innerHTML = data["goals"]["home"] + " - " + data["goals"]["away"];
        if (data["goals"]["home"] == null && data["goals"]["away"] == null) {
            score.innerHTML = " - ";
        }

        matchtile.appendChild(tiletime);
        matchtile.appendChild(homeTeam);
        matchtile.appendChild(score);
        matchtile.appendChild(awayTeam);
        ligueTable.appendChild(matchtile);
    }
}

eplFetch();
laligaFetch();
serieaFetch();
bundesligaFetch();
ligueFetch();

//Afegeix la classe "selected" al 4t botó, que és el que volem que etigui seleccionat per defecte
document.getElementById("scoreBtn4").classList.add("selected");
//Canviar el botó seleccionat per mostrar el "border" al botó que correspon.
$("button").on("click", function () {
    $("button").removeClass("selected");
    $(this).addClass("selected");
});

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

//Funció que crida el "fetch" amb el paràmetre de la data corresponen al botó clicat
function fetchBtn1() {
    day = todaydate.getDate()-3;
    dateString = year + "-" + month + "-" + day;

    //Bloc de codi que esborra els elements fills de la taula de partits de cada lliga
    while (eplTable.firstChild) {
        eplTable.removeChild(eplTable.lastChild);
    }
    while (laligaTable.firstChild) {
        laligaTable.removeChild(laligaTable.lastChild);
    }
    while (serieaTable.firstChild) {
        serieaTable.removeChild(serieaTable.lastChild);
    }
    while (bundesligaTable.firstChild) {
        bundesligaTable.removeChild(bundesligaTable.lastChild);
    }
    while (ligueTable.firstChild) {
        ligueTable.removeChild(ligueTable.lastChild);
    }

    eplFetch(dateString);
    laligaFetch(dateString);
    serieaFetch(dateString);
    bundesligaFetch(dateString);
    ligueFetch(dateString);
    console.log(dateString);
}
function fetchBtn2() {
    day = todaydate.getDate()-2;
    dateString = year + "-" + month + "-" + day;

    while (eplTable.firstChild) {
        eplTable.removeChild(eplTable.lastChild);
    }
    while (laligaTable.firstChild) {
        laligaTable.removeChild(laligaTable.lastChild);
    }
    while (serieaTable.firstChild) {
        serieaTable.removeChild(serieaTable.lastChild);
    }
    while (bundesligaTable.firstChild) {
        bundesligaTable.removeChild(bundesligaTable.lastChild);
    }
    while (ligueTable.firstChild) {
        ligueTable.removeChild(ligueTable.lastChild);
    }

    eplFetch(dateString);
    laligaFetch(dateString);
    serieaFetch(dateString);
    bundesligaFetch(dateString);
    ligueFetch(dateString);
    console.log(dateString);
}
function fetchBtn3() {
    day = todaydate.getDate()-1;
    dateString = year + "-" + month + "-" + day;

    while (eplTable.firstChild) {
        eplTable.removeChild(eplTable.lastChild);
    }
    while (laligaTable.firstChild) {
        laligaTable.removeChild(laligaTable.lastChild);
    }
    while (serieaTable.firstChild) {
        serieaTable.removeChild(serieaTable.lastChild);
    }
    while (bundesligaTable.firstChild) {
        bundesligaTable.removeChild(bundesligaTable.lastChild);
    }
    while (ligueTable.firstChild) {
        ligueTable.removeChild(ligueTable.lastChild);
    }

    eplFetch(dateString);
    laligaFetch(dateString);
    serieaFetch(dateString);
    bundesligaFetch(dateString);
    ligueFetch(dateString);
    console.log(dateString);
}
function fetchBtn4() {
    day = todaydate.getDate();
    dateString = year + "-" + month + "-" + day;

    while (eplTable.firstChild) {
        eplTable.removeChild(eplTable.lastChild);
    }
    while (laligaTable.firstChild) {
        laligaTable.removeChild(laligaTable.lastChild);
    }
    while (serieaTable.firstChild) {
        serieaTable.removeChild(serieaTable.lastChild);
    }
    while (bundesligaTable.firstChild) {
        bundesligaTable.removeChild(bundesligaTable.lastChild);
    }
    while (ligueTable.firstChild) {
        ligueTable.removeChild(ligueTable.lastChild);
    }

    eplFetch(dateString);
    laligaFetch(dateString);
    serieaFetch(dateString);
    bundesligaFetch(dateString);
    ligueFetch(dateString);
    console.log(dateString);
}
function fetchBtn5() {
    day = todaydate.getDate()+1;
    dateString = year + "-" + month + "-" + day;

    while (eplTable.firstChild) {
        eplTable.removeChild(eplTable.lastChild);
    }
    while (laligaTable.firstChild) {
        laligaTable.removeChild(laligaTable.lastChild);
    }
    while (serieaTable.firstChild) {
        serieaTable.removeChild(serieaTable.lastChild);
    }
    while (bundesligaTable.firstChild) {
        bundesligaTable.removeChild(bundesligaTable.lastChild);
    }
    while (ligueTable.firstChild) {
        ligueTable.removeChild(ligueTable.lastChild);
    }

    eplFetch(dateString);
    laligaFetch(dateString);
    serieaFetch(dateString);
    bundesligaFetch(dateString);
    ligueFetch(dateString);
    console.log(dateString);
}
function fetchBtn6() {
    day = todaydate.getDate()+2;
    dateString = year + "-" + month + "-" + day;

    while (eplTable.firstChild) {
        eplTable.removeChild(eplTable.lastChild);
    }
    while (laligaTable.firstChild) {
        laligaTable.removeChild(laligaTable.lastChild);
    }
    while (serieaTable.firstChild) {
        serieaTable.removeChild(serieaTable.lastChild);
    }
    while (bundesligaTable.firstChild) {
        bundesligaTable.removeChild(bundesligaTable.lastChild);
    }
    while (ligueTable.firstChild) {
        ligueTable.removeChild(ligueTable.lastChild);
    }

    eplFetch(dateString);
    laligaFetch(dateString);
    serieaFetch(dateString);
    bundesligaFetch(dateString);
    ligueFetch(dateString);
    console.log(dateString);
}
function fetchBtn7() {
    day = todaydate.getDate()+3;
    dateString = year + "-" + month + "-" + day;

    while (eplTable.firstChild) {
        eplTable.removeChild(eplTable.lastChild);
    }
    while (laligaTable.firstChild) {
        laligaTable.removeChild(laligaTable.lastChild);
    }
    while (serieaTable.firstChild) {
        serieaTable.removeChild(serieaTable.lastChild);
    }
    while (bundesligaTable.firstChild) {
        bundesligaTable.removeChild(bundesligaTable.lastChild);
    }
    while (ligueTable.firstChild) {
        ligueTable.removeChild(ligueTable.lastChild);
    }

    eplFetch(dateString);
    laligaFetch(dateString);
    serieaFetch(dateString);
    bundesligaFetch(dateString);
    ligueFetch(dateString);
    console.log(dateString);
}