import ProgressBar from "progressbar.js";
import {Redirect} from "../Router/Router";
import {getSessionObject} from "../../utils/session";

const Swal = require('sweetalert2');
"use strict";
let decompte;
let bar = new ProgressBar.Line();
let position = 0;
let list_answer;
let answer_user;
let questions;
let answers;
let difficulty;
let html_difficulty;
let time_answer;
let finale_score = 0;

let myPage = `<div id="page" class="container-fluid">
        <div id="bar-progress" class="row">
        </div>
        <div id="cooldown" class="row justify-content-center h2 text-danger">
        </div>

        <div id="diff-question-pos" class="container-md  pt-3">
            <div class="row header-question align-items-center text-center">
                <div class="col-sm-3" id="difficulty">
                   
                </div>
                <div class="col-sm-6">
                    <p class="h2" id="theQuestion"></p>
                </div>
                <div class="col-sm-3" id="nbQuestion">
                </div>

            </div>

        </div>


        <div id="answers" class="container-md text-center">
        </div>

    </div>`;



async function GamePage(params) {
    // if user tries to access directly with /Game with no parameters
    if (params === undefined) {
        Redirect("/");
        return;
    }
    const myMain = document.querySelector("main");
    myMain.innerHTML = myPage;

    list_answer = [];
    answer_user = [];
    time_answer = [];
    finale_score = 0;
    decompte = 0;
    questions = null;
    answers = null;
    difficulty = params[1];
    getDifficulty(difficulty);
    position = 0;
    let difficult = document.getElementById("difficulty");
    difficult.innerText = html_difficulty;


    await getQuestions(params[0]);
    insertProgressBar();
    window.myInterval = setInterval(timer, 1000);
    await questionSuivante(position);


}



/*
* We get the questions with fetch and we put them in the questions array
* */
async function getQuestions(_id_quizz) {
    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: getSessionObject("user").token
            },
        };
        const response = await fetch("/api/questions?quizz=" + _id_quizz, options);

        if (!response.ok) {
            throw new Error(
                "fetch error : " + response.status + " : " + response.statusText
            );
        }
        questions = await response.json();
    } catch (err) {
        console.error("getQuestions::error: ", err);
    }
}
/*
* We get the answers with fetch
* @return answers
* */
async function getAnswers(_id_question) {
    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: getSessionObject("user").token
            },
        };
        const response = await fetch("/api/answers/allAnswers/" + _id_question, options);

        if (!response.ok) {
            throw new Error(
                "fetch error : " + response.status + " : " + response.statusText
            );
        }
        const _answers = await response.json();

        return _answers;
    } catch (err) {
        console.error("getAnswers::error: ", err);
    }
}
/*
* We set the properties of the ProgressBar
* And we add it in the page
* */
function insertProgressBar() {
    //Bar
    let divBar = document.getElementById('bar-progress');
    bar = new ProgressBar.Line(divBar, {  // add in the page
        strokeWidth: 4,
        easing: 'linear',
        duration: getDifficulty(difficulty),
        color: '#ED6A5A',
        from: {color: '#ED6A5A'},
        to: {color: '#FFEA82'},
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
        },
        svgStyle: {width: '100%', height: '25px'},
    });
    let pc = 1;
    bar.set(pc);  // Number from 0.0 to 1.0
    bar.animate(0);
}
/*
* countdown for the user
* */
function timer() {
    //countdown
    const cool = document.getElementById('cooldown');
    if (decompte === 0) {
        clearInterval(timer);
        flipAnswer();
        return;
    }
    decompte -= 1;
    cool.innerText = decompte;
}


//we make the answer html
function html_answer() {
    const divAnswer = document.getElementById('answers');
    let html_answer = "";
    list_answer = []; // reset de la liste
    let percent = Math.ceil(((position + 1) / questions.length) * 100);
    for (const element of answers) {
        list_answer[list_answer.length] = element;
        let color;
        if (element.correct) color = "bg-success";
        else color = "bg-danger";
        html_answer += `
            <div class="cards__single">
            
                 <div class="cards__front">
                    <div class="answer text-center padding-card mt-4 shadow container bg-dark text-white" style="width: 70%; height: 8vh;">
                        ${element.answer}
                    </div>
                </div>  
                 <div class="cards__back" id="answer_${list_answer.length}">
                 </div>  
            </div>
                  
        `;
    }
    html_answer += `
                <div class="progress mt-5">
                    <div class="progress-bar" role="progressbar" style="width: ${percent}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${percent}%</div>
                </div>

            <button class="btn btn-primary mt-5" type="submit" id="nextQuestion">Question suivante</button>
    `;
    divAnswer.innerHTML = html_answer;
}
/*
* Summary of  questions & answers
*/
function showQuestionWithMyAnswer() {
    let id = this.id;
    let index = id - 1;
    let reponse;
    if (answer_user[index] === "vide") reponse = 'Aucune réponse sélectionnée';
    else reponse = answer_user[index].answer;
    Swal.fire({
        title: ` Question : ${questions[index].question}`,
        html: `Votre réponse : ${reponse}`,
        width: 700,
        padding: '3em',
        color: '#090808',
        scrollbarPadding: false,
        backdrop: `  rgba(80,80,80,0.7) `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Retour au recap de vos questions',
        preConfirm: (login) => {
            endGame();
        }
    })
}
/*
* disposition of the questions answered with theirs answers
*/
function html_endGame() {
    let modalPage = "";
    let color;
    let compteur = 1;
    for (let i = 0; i < 8 / 3; i++) {
        modalPage += `
        <div class="row" >
    `;
        for (let j = 0; j < 3; j++) {
            let indice = j + (i * 3);
            if (questions[indice] === undefined) break;
            if (answer_user[indice] !== undefined && answer_user[indice].correct) color = "btn-success";
            else color = "btn-danger";
            modalPage += `<div class="col">
            <button class="btn ${color} mt-3 btn-recap" id="${compteur}">Question ${compteur}</button>
        </div>`;
            compteur++;
        }
        modalPage += `</div>`;
    }
    return modalPage;
}
/*
Modal for the summary
 */
function endGame() {
    Swal.fire({
        title: 'Récapitulatif des réponses & votre score : ' + finale_score,
        html: html_endGame(),
        width: 1000,
        padding: '3em',
        color: '#bf1139',
        scrollbarPadding: false,
        backdrop: `  rgba(80,80,80,0.7) `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Retour à la page d\'accueil',
        preConfirm: (login) => {
            Redirect("/");
        }
    })
    let btnRecap = document.querySelectorAll(".btn-recap");
    btnRecap.forEach((recap) => recap.addEventListener("click", showQuestionWithMyAnswer));
    let sal = document.getElementById('swal2-html-container');
    sal.style.overflow = "visible";
}
/*
We get the final score of the user
 */
async function getScore() {
    let score = 0;
    for (let i = 0; i < answer_user.length - 1; i++) {
        if (answer_user[i].correct) {
            if (difficulty === 1) {
                score += 98 * time_answer[i] * parseInt(difficulty);
            }
            if (difficulty === 2) {
                score += 214 * time_answer[i] * parseInt(difficulty);
            }
            if (difficulty === 3) {
                score += 412 * time_answer[i] * parseInt(difficulty);
            }
        }
    }
    finale_score = score;
}
/*
We save the answers user in the DB with the score
 */
async function saveDatabase() {
    let participation;
    try {
        let options = {
            method: "POST",
            body: JSON.stringify({
                "id_quizz": questions[0].id_quizz,
                "id_user": getSessionObject("user").id_user,
                "score": finale_score,
                "difficulty": parseInt(difficulty)
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: getSessionObject("user").token,
            },
        };
        participation = await fetch("/api/participations/", options);
        if (!participation.ok) {
            throw new Error("fetch error : " + participation.status + " : " + participation.statusText);
        }
    } catch (err) {
        console.log(err);
    }
    participation = await participation.json();
    for (let i = 0; i < answer_user.length - 1; i++) {
        if(answer_user[i]!=="vide"){
            try {
                let options = {
                    method: "POST",
                    body: JSON.stringify({
                        "id_participation": participation.id_participation,
                        "id_answer": answer_user[i].id_answer,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getSessionObject("user").token,
                    },
                };
                let retour = await fetch("/api/participations/answers/", options);
                if (!retour.ok) {
                    throw new Error("fetch error : " + retour.status + " : " + retour.statusText);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

}


// we change the question and the answer
async function questionSuivante(index) {
    //recupération de mes questions depuis 1 quizz
    if (index > questions.length - 1) {
        flipAnswer();
        await getScore();
        endGame();
        await saveDatabase();
        return;
    }
    let Quest = document.getElementById('theQuestion');
    Quest.innerHTML = questions[index].question;

    //nb question
    const nbQuestion = document.getElementById('nbQuestion');
    nbQuestion.innerText = (index + 1) + "/" + questions.length;

    //recuperation des reponses du quizz
    answers = await getAnswers(questions[index].id_question);
    //mise des reponses dans html
    html_answer();
    let btnNext = document.getElementById('nextQuestion');
    btnNext.addEventListener("click", async e => {
        e.preventDefault();
        clearInterval(window.myInterval);
        restartCountdown();
        if (answer_user[position] === undefined) answer_user[position] = "vide";
        await questionSuivante(++position);
    })

    let answerFlip = document.querySelectorAll(".cards__single");
    answerFlip.forEach((answer) => answer.addEventListener("click", saveAnswerUser));
}//fin question suivant

//restart the countdown when the user click on the next question button
function restartCountdown() {
    bar.set(1); //restart progress bar
    bar.animate(0); //restart progress bar
    getDifficulty(difficulty);
    window.myInterval = setInterval(timer, 1000);
}

function insertionAnswerBack() {
    for (let i = 0; i <= 3; i++) {
        let string = `answer_` + (i + 1);
        let getDivBack = document.getElementById(string);
        let color;
        let element = list_answer[i];
        if (element.correct) color = "bg-success";
        else color = "bg-danger";
        let divBack = `
                     <div class="answer padding-card mt-4 shadow container ${color} text-white" style="width: 70%; height: 8vh;">
                        ${element.answer}
                    </div>
        `;
        getDivBack.innerHTML = divBack;
    }
}

//save answer user in the list answer_user
// this.children[1].id: it's to receive the id of the answer select
function saveAnswerUser() {
    if (answer_user[position]) { // cant change his answer !!
        flipAnswer();
        return;
    }

    let id = this.children[1].id;

    for (let i = 1; i <= list_answer.length; i++) {
        let id_tmp = "answer_" + i;
        if (id === id_tmp) {
            answer_user[position] = list_answer[i - 1];
            time_answer[position] = decompte;
        }
    }
    flipAnswer();
}

//we stop the cooldown here and the progress bar
// we add the the true result behind the choices because the user can see the answers with F12 with the function "insertionAnswerBack"
function flipAnswer() {
    if (answer_user[position] === undefined) answer_user[position] = "vide";
    clearInterval(window.myInterval);
    bar.stop();
    insertionAnswerBack();
    let answers = document.querySelectorAll(".cards__single");
    for (const theAnswer of answers) {
        theAnswer.classList.add("flip");
    }
}
/*
Set the difficulty who the player has chosen
 */
function getDifficulty(id) {
    if (id === 1) {
        decompte = 30;
        html_difficulty = "Easy";
        return 30000;
    }
    if (id === 2) {
        decompte = 20;
        html_difficulty = "Medium";
        return 20000;
    }
    if (id === 3) {
        decompte = 10;
        html_difficulty = "Hard";
        return 10000;
    }
}


export {GamePage};

