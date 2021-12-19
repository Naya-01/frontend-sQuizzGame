import thumb from "../../img/thumb.png";
import {getSessionObject} from "../../utils/session";
import {setSessionObject} from "../../utils/session";
import {removeSessionObject} from "../../utils/session";
import {Redirect, RedirectWithParams, RedirectWithParamsInUrl} from "../Router/Router";
import Swal from "sweetalert2";

/**
 * Layout de base de la page
 */
let myPage = `<div class="container">
        <h1 class="text-center text-break" id="titre-quizz"></h1>
        <div class="row">
            <div class="col text-start"><a class="fs-3 btn btn-light text-dark rounded rounded-pill
             border border-dark border-2 border creator-size" id="quizz-creator"><span class="text-break" >Mehdi</span></a></div>
            <div class="col text-end">
                <button type="submit" name="button_like" id="btn-like" class="fs-1 bg-transparent btn btn-lg shadow-none text-dark text-decoration-none" value="63">
                    <img src="${thumb}" width="60" alt="vote" class="img-fluid thumb"><span id="like-quizz"></span>
                </button>
            </div>
        </div>
        <div class="row mb-5">
            <div class="col-3"></div>
            <div class="col-6">
                <p class="fs-4 text-center text-break" id="quizz-description"></p>
            </div>
            <div class="col-3"></div>
        </div>


<div class="row mb-5">
        <!--  Meilleurs Scores   -->
        <div class="col-lg-4 col-md-12 col-sm-12" id="best-scores">
            <div class="row m-auto">
                <span class="fs-3 p-2 text-center text-dark
                    border border-dark border-2 border">Meilleurs scores</span>
            </div>
        </div>
        
        <!-- Millieu -->
        <div class="col-lg-4 col-md-12 col-sm-12">
            <div class="row m-auto" id="notifRow">
                
            </div>
            <div class="row mb-2 mt-5">
                <div class="col mb-2">
                    <div>
                        <button class="btn cursor btn-light text-white
                        border border-dark border-2 border rounded rounded-pill bg-success fs-4" value="easy" id="easy">Facile</b>
                    </div>
                </div>
                <div class="col">
                    <div>
                        <button class="btn cursor btn-light text-white
                        border border-dark border-2 border rounded rounded-pill bg-warning fs-4" value="medium" id="medium">Moyen</button>
                    </div>
                </div>
                <div class="col">
                    <div>
                        <button class="btn cursor btn-light text-white
                        border border-dark border-2 border rounded rounded-pill bg-danger fs-4" value="hard" id="hard">Difficile</button>
                    </div>
                </div>
            </div>
            <div class="row m-auto mb-5">
                <button class="btn btn-light btn-lg text-dark
                border border-dark border-2 border fs-4 p-4" id="play">Commencer le Quizz</button>
            </div>
        </div>
        

        <!-- Scores Personnels-->
        <div class="col-lg-4 col-md-12 col-sm-12" id="personnal-best-scores">
            <div class="row m-auto">
                <span class="fs-3 p-2 text-center text-dark
                    border border-dark border-2 border">Mes meilleurs scores</span>
            </div>
        </div>
    </div>
    </div>`;

/**
 * Traduit l'id de difficulté en string
 * @param id de la difficulté
 * @returns {string} difficultée
 */
function getDifficulty(id){
    if(id===1)return "Facile";
    if(id===2)return "Moyen";
    else return "Difficile";
}


/**
 * Renvoi le nombre de like pour le quizz
 * @param id du quizz
 * @returns {Promise<*>} l'objet json contenant le nombre de like du quizz
 */
async function getLikes(id) {
    let currentLikes;
    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: getSessionObject("user").token
            },
        };
        currentLikes = await fetch("/api/quizz/likes/" + id, options);
        if (!currentLikes.ok) {
            throw new Error(
                "fetch error : " + currentLikes.status + " : " + currentLikes.statusText
            );
        }
    } catch (err) {
        console.error(err);
    }
    return await currentLikes.json();
}

async function QuizzPage(id) {
    /**
     * Prevention du F5, si l'user actualise la page, on regarde dans quel quizz il était grace au localStorage
     * Sinon on met l'id du quizz à la première navigation sur cette page dans le localstorage
     */
    if(id){
        const object = {
            id_quizz: id
        }
        setSessionObject("current_quizz",object);
    }else{
        let current_quizz = getSessionObject("current_quizz");
        if(current_quizz===undefined)Redirect("/");
        id = current_quizz.id_quizz;
    }

    // Initialisation du layout de base
    const myMain = document.querySelector("main");
    myMain.innerHTML = myPage;
    // Recupération des données du quizz
    let quizz;
    try{
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: getSessionObject("user").token
            },
        };
        quizz = await fetch("/api/quizz/"+id,options);
        if (!quizz.ok) {
            throw new Error(
                "fetch error : " + quizz.status + " : " + quizz.statusText
            );
        }
    } catch (err) {
        console.error(err);
    }
    quizz = await quizz.json();
    // Récupération des données de l'utilisateurs dans le localStorage.
    let user = getSessionObject("user");


    // J'affiche le nombre de like sur ma page
    let likes = await getLikes(id);
    let like = document.getElementById("like-quizz");
    like.innerText = likes[0].nblikes;

    // J'affiche le titre de ma page avec un innerHTML pour l'échappement
    let titre = document.getElementById("titre-quizz");
    titre.innerHTML = quizz.name;

    // J'affiche la description de ma page avec un innerHTML pour l'échappement
    let description = document.getElementById("quizz-description");
    description.innerHTML = quizz.description;

    // J'affiche le nom du createur du quizz avec un innerHTML pour l'échappement
    let creatorName = document.getElementById("quizz-creator");
    let creatorUserName;
    if(quizz.username.length>7){
        creatorUserName = quizz.username.substring(0,6)+"...";
    }else{
        creatorUserName = quizz.username;
    }
    creatorName.innerHTML ="Créer par : "+creatorUserName;

    // Je récupère les derniers scores du joueur
    let lastPersonnalsScores;
    try{
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: getSessionObject("user").token
            },
        };
        lastPersonnalsScores = await fetch("/api/participations/personnalsBestScores?id_quizz="+id+"&id_user="+user.id_user,options);
        if (!lastPersonnalsScores.ok) {
            throw new Error(
                "fetch error : " + lastPersonnalsScores.status + " : " + lastPersonnalsScores.statusText
            );
        }
    } catch (err) {
        console.error(err);
    }
    lastPersonnalsScores = await lastPersonnalsScores.json();


    // Si ya pas encore de score alors j'affiche que y'en a pas encore
    if(lastPersonnalsScores.length===0){
        let bestScores = document.getElementById("personnal-best-scores");
        let row = document.createElement("div");
        row.className = "row mt-3";
        let span = document.createElement("span");
        span.className = "no-score fs-3 btn btn-light bg-grey fw-bolder text-dark border border-dark border-2 border";
        span.innerText = "Aucun score disponible";
        row.appendChild(span);
        bestScores.append(row);
    }else{ // j'affiches les scores existant
        for (let i = 0 ; i < lastPersonnalsScores.length ; i++){
            let bestScores = document.getElementById("personnal-best-scores");
            let rowScore = document.createElement("div");
            rowScore.className = "row mt-3";
            let rowScoreColumn1 = document.createElement("div");
            rowScoreColumn1.className = "col-4";
            let rowScoreColumn2 = document.createElement("div");
            rowScoreColumn2.className = "col-8";
            let rowScoreColumn1Div = document.createElement("div");
            let spanFirstColumn = document.createElement("span");
            spanFirstColumn.className = "btn btn-light text-dark border border-dark border-2 border fs-4 margin-right-scores scores-size"
            spanFirstColumn.innerText = getDifficulty(lastPersonnalsScores[i].difficulty);
            let rowScoreColumn2Div = document.createElement("div");
            let spanSecondColumn = document.createElement("span");
            spanSecondColumn.className = "btn btn-light text-dark border border-dark border-2 border fs-4 score";
            spanSecondColumn.innerText = lastPersonnalsScores[i].score;
            rowScoreColumn1Div.appendChild(spanFirstColumn);
            rowScoreColumn1.appendChild(rowScoreColumn1Div);
            rowScore.appendChild(rowScoreColumn1);
            rowScoreColumn2Div.appendChild(spanSecondColumn);
            rowScoreColumn2.appendChild(rowScoreColumn2Div);
            rowScore.appendChild(rowScoreColumn2);
            bestScores.append(rowScore);
        }
    }


    // Je récupère tout les meilleurs scores du quizz
    let allBestScores;
    try{
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: getSessionObject("user").token
            },
        };
        allBestScores = await fetch("/api/participations/bestScores/" + id,options);
        if (!allBestScores.ok) {
            throw new Error(
                "fetch error : " + allBestScores.status + " : " + allBestScores.statusText
            );
        }
    } catch (err) {
        console.error(err);
    }
    allBestScores = await allBestScores.json();

    // Si aucun score n'a été enregistré, je vais afficher qu'il n'y en a pas
    if(allBestScores.length===0){
        let bestScores = document.getElementById("best-scores");
        let row = document.createElement("div");
        row.className = "row mt-3";
        let span = document.createElement("span");
        span.className = "fs-3 no-score btn btn-light bg-grey fw-bolder text-dark border border-dark border-2 border";
        span.innerText = "Aucun score disponible";
        row.appendChild(span);
        bestScores.append(row);
    }else{ // J'affiches les meilleurs scores trouvés (maximum 3)
        for (let i = 0 ; i < allBestScores.length ; i++){
            let bestScores = document.getElementById("best-scores");
            let rowScore = document.createElement("div");
            rowScore.className = "row mt-3";
            let rowScoreColumn1 = document.createElement("div");
            rowScoreColumn1.className = "col-4";
            let rowScoreColumn2 = document.createElement("div");
            rowScoreColumn2.className = "col-8";
            let rowScoreColumn1Div = document.createElement("div");
            let spanFirstColumn = document.createElement("span");
            spanFirstColumn.className = "btn btn-light text-dark border border-dark border-2 border fs-4 margin-right-scores scores-size"
            spanFirstColumn.innerText = getDifficulty(allBestScores[i].difficulty);
            let rowScoreColumn2Div = document.createElement("div");
            let spanSecondColumn = document.createElement("span");
            spanSecondColumn.className = "btn btn-light text-dark border border-dark border-2 border fs-4 score";
            spanSecondColumn.innerText = allBestScores[i].name+" | "+allBestScores[i].score;
            rowScoreColumn1Div.appendChild(spanFirstColumn);
            rowScoreColumn1.appendChild(rowScoreColumn1Div);
            rowScore.appendChild(rowScoreColumn1);
            rowScoreColumn2Div.appendChild(spanSecondColumn);
            rowScoreColumn2.appendChild(rowScoreColumn2Div);
            rowScore.appendChild(rowScoreColumn2);
            bestScores.append(rowScore);
        }
    }


    // Bouton de redirection vers le profil du créateur du quizz
    // Si on est l'auteur on est redirigé sur notre profil
    let userRedirect = document.getElementById("quizz-creator");
    userRedirect.addEventListener("click",e =>{
        // verifier si l'user en stockage === l'user qui créer
        if(quizz.id_creator !== user.id_user){
            RedirectWithParamsInUrl("/Profil","?idUser="+quizz.id_creator);
        }else{
            Redirect("/Profil/MyProfil");
        }
    })

    // Bouton pour like notre quizz
    let btnLike = document.getElementById("btn-like");
    btnLike.addEventListener("click",async e => {
        // Je vérifie si j'ai déjà like ou pas, pour adapter la notification et la requête à la DB
        let isLiked;
        try{
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: getSessionObject("user").token
                },
            };
            isLiked = await fetch("/api/quizz/isLiked?id_quizz="+id+"&id_user="+user.id_user,options);
            if (!isLiked.ok) {
                throw new Error(
                    "fetch error : " + isLiked.status + " : " + isLiked.statusText
                );
            }
        } catch (err) {
            console.error(err);
        }
        isLiked = await isLiked.json();

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        // Si j'ai like , alors je vais dislike
        if(isLiked.isLiked){
            try {
                let options = {
                    method: "DELETE",
                    body: JSON.stringify({
                        id_quizz: id,
                        id_user: user.id_user,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getSessionObject("user").token
                    },
                };
                let reponse = await fetch("/api/quizz/unlike/", options);
                if (!reponse.ok) {
                    throw new Error("fetch error : " + reponse.status + " : " + reponse.statusText);
                }
            } catch (err) {
                console.log(err);
            }
            // Notification dislike
            Toast.fire({
                icon: 'error',
                title: 'Vous avez dislike.'
            })
            // Je met à jour le nombre de like sur l'affichage
            let likes = await getLikes(id);
            let like = document.getElementById("like-quizz");
            like.innerText = likes[0].nblikes;
        }else{ // Je like
            try {
                let options = {
                    method: "POST",
                    body: JSON.stringify({
                        id_quizz: id,
                        id_user: user.id_user,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getSessionObject("user").token
                    },
                };
                let reponse = await fetch("/api/quizz/likes/", options);
                if (!reponse.ok) {
                    throw new Error("fetch error : " + reponse.status + " : " + reponse.statusText);
                }
            } catch (err) {
                console.log(err);
            }
            // Notification like
            Toast.fire({
                icon: 'success',
                title: 'Vous avez like.'
            })
            // Je met à jour le nombre de like sur l'affichage
            let likes = await getLikes(id);
            let like = document.getElementById("like-quizz");
            like.innerText = likes[0].nblikes;
        }
    });

    let difficulty; // Je met la difficulté à undefined tant qu'il n'a pas cliqué
    let btnEasy = document.getElementById("easy");
    let btnEasyStyle = btnEasy.className; // J'enregistre le style par défaut
    let btnMedium = document.getElementById("medium");
    let btnMediumStyle = btnMedium.className; // J'enregistre le style par défaut
    let btnHard = document.getElementById("hard");
    let btnHardStyle = btnHard.className; // J'enregistre le style par défaut
    let btnPlay = document.getElementById("play");
    let difficultyPressed = false; // Il a appuyé sur aucune difficulté

    btnEasy.addEventListener("click", e => {
        e.preventDefault();
        if(document.getElementById("notif"))document.getElementById("notifRow").removeChild(document.getElementById("notif")); // Si il ya eu une notif, je l'efface
        btnEasy.className = "btn cursor btn-light text-dark border border-success border-2 border rounded rounded-pill bg-white fs-4"; // Si il appuis je modifie son affichage
        btnMedium.className = btnMediumStyle; // je remet le style par défaut
        btnHard.className = btnHardStyle; // je remet le style par défaut
        difficulty = 1; // Je met à jour la difficultée
        difficultyPressed = true; // Il a appuyé sur une difficultée
    })

    btnMedium.addEventListener("click", e => {
        e.preventDefault();
        if(document.getElementById("notif"))document.getElementById("notifRow").removeChild(document.getElementById("notif")); // Si il ya eu une notif, je l'efface
        btnMedium.className = "btn cursor btn-light text-dark border border-warning border-2 border rounded rounded-pill bg-white fs-4"; // Si il appuis je modifie son affichage
        btnHard.className = btnHardStyle; // je remet le style par défaut
        btnEasy.className = btnEasyStyle; // je remet le style par défaut
        difficulty = 2; // Je met à jour la difficultée
        difficultyPressed = true; // Il a appuyé sur une difficultée
    })

    btnHard.addEventListener("click", e => {
        e.preventDefault();
        if(document.getElementById("notif"))document.getElementById("notifRow").removeChild(document.getElementById("notif")); // Si il ya eu une notif, je l'efface
        btnHard.className = "btn cursor btn-light text-dark border border-danger border-2 border rounded rounded-pill bg-white fs-4"; // Si il appuis je modifie son affichage
        btnEasy.className = btnEasyStyle; // je remet le style par défaut
        btnMedium.className = btnMediumStyle; // je remet le style par défaut
        difficulty = 3; // Je met à jour la difficultée
        difficultyPressed = true; // Il a appuyé sur une difficultée
    })

    btnPlay.addEventListener("click", e => {
        e.preventDefault();
        if(document.getElementById("notif"))document.getElementById("notifRow").removeChild(document.getElementById("notif")); // Si il ya eu une notif, je l'efface
        if(!difficultyPressed){ // Si il a pas appuyé sur une difficulté alors j'envois une notification
            let notifRow = document.getElementById("notifRow");
            let notif = document.createElement("span");
            notif.id="notif";
            notif.className="fs-3 alert-warning text-center fw-bolder text-dark";
            notif.innerText="Veuillez selectionner une difficultée avant de jouer"
            notifRow.appendChild(notif);
        }else{ // Si il appuyé sur une difficulté
            let params = [id,difficulty]; // j'enregistre la difficulté et l'id quizz dans un tableau de paramètre
            removeSessionObject("current_quizz"); // Je vide le localstorage car il n'en a plus besoin plus loin dans le site.
            RedirectWithParams("/Game",params); // je le redirige vers la page de jeu avec les informations concernées
        }
    })
}

export {QuizzPage};
