import thumb from "../../img/thumb.png";
import {getSessionObject} from "../../utils/session";
import {setSessionObject} from "../../utils/session";
import {removeSessionObject} from "../../utils/session";
import {RedirectWithParams} from "../Router/Router";


let myPage = `<div class="container">
        <h1 class="text-center text-break" id="titre-quizz"></h1>
        <div class="row">
            <div class="col text-start"><a class="fs-3 btn btn-light text-dark rounded rounded-pill
             border border-dark border-2 border creator-size">Créer par : <span class="text-break" id="quizz-creator">Mehdi</span></a></div>
            <div class="col text-end">
                <button type="submit" name="button_like" class="fs-1 bg-transparent btn btn-lg shadow-none text-dark text-decoration-none" value="63">
                    <img src="${thumb}" width="60" alt="vote" class="img-fluid thumb"><span id="like-quizz"></span>
                </button>
            </div>
        </div>
        <div class="row mb-5">
            <div class="col-3"></div>
            <div class="col-6">
                <h2 class="text-center">Bienvenue sur mon quizz !</h2>
                <p class="fs-4 text-center text-break" id="quizz-description"></p>
                <p class="fs-4 text-center">Amusez-vous bien 😁</p>
            </div>
            <div class="col-3"></div>
        </div>


<div class="row">
        <!--  Meilleurs Scores   -->
        <div class="col" id="best-scores">
            <div class="row m-auto">
                <span class="fs-3 btn btn-light text-dark
                    border border-dark border-2 border">Meilleurs scores</span>
            </div>
        </div>
        
        <!-- Millieu -->

        <div class="col">
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
                border border-dark border-2 border fs-4" id="play">Commencer le Quizz</button>
            </div>
        </div>
        

        <!-- Scores Personnels-->
        <div class="col" id="personnal-best-scores">
            <div class="row m-auto">
                <span class="fs-3 btn btn-light text-dark
                    border border-dark border-2 border">Mes meilleurs scores</span>
            </div>
        </div>
    </div>
    </div>`;

function getDifficulty(id){
    if(id===1)return "Facile";
    if(id===2)return "Moyen";
    else return "Difficile";
}

async function QuizzPage(id) {

    if(id){
        const object = {
            id_quizz: id
        }
        setSessionObject("current_quizz",object);
    }else{
        let current_quizz = getSessionObject("current_quizz");
        id = current_quizz.id_quizz;
    }

    console.log(id);
    const myMain = document.querySelector("main");
    myMain.innerHTML = myPage;

    let user = getSessionObject("user");

    let quizz =  await fetch("/api/quizz/" + id);
    quizz = await quizz.json();

    let likes = await fetch("/api/quizz/likes/" + id)
    likes = await likes.json();

    let like = document.getElementById("like-quizz");
    like.innerText = likes[0].nblikes;

    let titre = document.getElementById("titre-quizz");
    titre.innerText = quizz.name;

    let description = document.getElementById("quizz-description");
    description.innerText = quizz.description;

    let creatorName = document.getElementById("quizz-creator");
    creatorName.innerText = quizz.username;

   let personnalsBestScores = await fetch("/api/participations/personnalsBestScores?id_quizz="+id+"&id_user="+user.id_user);
    personnalsBestScores = await personnalsBestScores.json();
    console.log(personnalsBestScores);

    if(personnalsBestScores.length===0){
        let bestScores = document.getElementById("personnal-best-scores");
        let row = document.createElement("div");
        row.className = "row mt-3";
        let span = document.createElement("span");
        span.className = "fs-3 btn btn-light bg-warning fw-bolder text-dark border border-dark border-2 border";
        span.innerText = "Aucun score disponible";
        row.appendChild(span);
        bestScores.append(row);
    }else{
        for (let i = 0 ; i < personnalsBestScores.length ; i++){
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
            spanFirstColumn.innerText = getDifficulty(personnalsBestScores[i].difficulty);
            let rowScoreColumn2Div = document.createElement("div");
            let spanSecondColumn = document.createElement("span");
            spanSecondColumn.className = "btn btn-light text-dark border border-dark border-2 border fs-4 score";
            spanSecondColumn.innerText = personnalsBestScores[i].score;
            rowScoreColumn1Div.appendChild(spanFirstColumn);
            rowScoreColumn1.appendChild(rowScoreColumn1Div);
            rowScore.appendChild(rowScoreColumn1);
            rowScoreColumn2Div.appendChild(spanSecondColumn);
            rowScoreColumn2.appendChild(rowScoreColumn2Div);
            rowScore.appendChild(rowScoreColumn2);
            bestScores.append(rowScore);
        }
    }

    let difficulty;
    let btnEasy = document.getElementById("easy");
    let btnMedium = document.getElementById("medium");
    let btnHard = document.getElementById("hard");
    let btnPlay = document.getElementById("play");

    btnEasy.addEventListener("click", e => {
        e.preventDefault();
        if(document.getElementById("notif"))document.getElementById("notifRow").removeChild(document.getElementById("notif"));
        difficulty = 1;
    })

    btnMedium.addEventListener("click", e => {
        e.preventDefault();
        if(document.getElementById("notif"))document.getElementById("notifRow").removeChild(document.getElementById("notif"));
        difficulty = 2;
    })

    btnHard.addEventListener("click", e => {
        e.preventDefault();
        if(document.getElementById("notif"))document.getElementById("notifRow").removeChild(document.getElementById("notif"));
        difficulty = 3;
    })

    btnPlay.addEventListener("click", e => {
        e.preventDefault();
        if(document.getElementById("notif"))document.getElementById("notifRow").removeChild(document.getElementById("notif"));
        if(!difficulty){
            let notifRow = document.getElementById("notifRow");
            let notif = document.createElement("span");
            notif.id="notif";
            notif.className="fs-3 alert-warning text-center fw-bolder text-dark";
            notif.innerText="Veuillez selectionner une difficultée avant de jouer"
            notifRow.appendChild(notif);
        }else{
            let params = [id,difficulty];
            removeSessionObject("current_quizz");
            RedirectWithParams("/Game",params);
        }
    })

    let allBestScores = await fetch("/api/participations/bestScores/" + id);
    allBestScores = await allBestScores.json();

    if(allBestScores.length===0){
        let bestScores = document.getElementById("best-scores");
        let row = document.createElement("div");
        row.className = "row mt-3";
        let span = document.createElement("span");
        span.className = "fs-3 btn btn-light bg-warning fw-bolder text-dark border border-dark border-2 border";
        span.innerText = "Aucun score disponible";
        row.appendChild(span);
        bestScores.append(row);
    }else{
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
            spanFirstColumn.innerText = ""+(i+1);
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
}

export {QuizzPage};
