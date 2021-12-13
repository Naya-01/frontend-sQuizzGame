import ProgressBar from "progressbar.js";
import {Redirect} from "../Router/Router";
const Swal = require('sweetalert2');
const Swal2 = require('sweetalert2');
"use strict";

const myMain = document.querySelector("main");
let easy=30000;
let medium=20000;
let hard=10000;
let position=0;
let list_answer = [];
let answer_user=[];
let myInterval;
let decompte;
let bar = new ProgressBar.Line();
let questions;
let answers;
let difficulty;
let myPage = `<div id="page" class="container-fluid">
        <div id="bar-progress" class="row">
        </div>
        <div id="cooldown" class="row justify-content-center h2 text-danger">
        </div>

        <div id="diff-question-pos" class="container-md  pt-5">
            <div class="row header-question align-items-center text-center">
                <div class="col-sm-3" id="difficulty">
                    easy
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

async function getQuestions(_id_quizz){
    try {
        const response = await fetch("/api/questions?quizz=" + _id_quizz);

        if (!response.ok) {
            throw new Error(
                "fetch error : " + response.status + " : " + response.statusText
            );
        }
        questions = await response.json();
    } catch (err) {
        console.error("getQuizz::error: ", err);
    }
}

async function getAnswers(_id_question){
    try {
        const response = await fetch("/api/answers/allAnswers/" + _id_question);

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

function insertProgressBar(){
    //Bar
    let divBar = document.getElementById('bar-progress');
    bar = new ProgressBar.Line(divBar, {
        strokeWidth: 4,
        easing: 'linear',
        duration: getDifficulty(difficulty),
        color: '#FFEA82',
        svgStyle: {width: '100%', height: '25px'},
    });
    let pc = 1;
    bar.set(pc);  // Number from 0.0 to 1.0
    bar.animate(0);
}

function timer(){
    //countdown
    timer = function (){
        if(decompte===0){
            clearInterval(timer);
            flipAnswer();
            return;
        }
        const cool = document.getElementById('cooldown');
        decompte-=1;
        cool.innerText=decompte;
    }
    myInterval=setInterval(timer,1000);
}


//we make the answer html
function html_answer(){
    const divAnswer= document.getElementById('answers');
    let html_answer="";
    list_answer=[]; // reset de la liste
    for (const element of answers) {
        list_answer[list_answer.length]=element;
        let color;
        if(element.correct) color="bg-success";
        else color="bg-danger";
        html_answer += `
            <div class="cards__single">
            
                 <div class="cards__front">
                    <div class="answer p-5 mt-4 shadow p-3 container bg-dark text-white" style="width: 70%;">
                        ${element.answer}
                    </div>
                </div>  
                 <div class="cards__back" id="answer_${list_answer.length}">
                 </div>  
            </div>
                  
        `;
    }
    html_answer +=`
                <div class="row">
                <div class="progress mt-5">
                    <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                </div>
            </div>

            <button class="btn btn-primary mt-5" type="submit" id="nextQuestion">Question suivante</button>
    `;
    divAnswer.innerHTML = html_answer;
}

function showQuestionWithMyAnswer(){
    let id = this.id;
    let index = id-1;
    let reponse;
    if(answer_user[index]==="vide") reponse='Aucune réponse sélectionnée';
    else reponse=answer_user[index].answer;
    Swal.fire({
        title: ` Question : ${questions[index].question}`,
        html: `Votre réponse : ${reponse}`,
        width: 500,
        padding: '3em',
        color: '#090808',
        scrollbarPadding: false,
        backdrop: `  rgba(80,80,80,0.7) `,
        allowOutsideClick : false,
        allowEscapeKey: false,
        confirmButtonText: 'Retour au recap de vos questions',
        preConfirm: (login)=> {
            endGame();
        }
    })
}

function html_endGame(){
    let modalPage="";
    let color;
    let compteur=1;
    for(let i=0;i<8/3;i++){
        modalPage +=`
        <div class="row" >
    `;
        for(let j=0;j<3;j++){
            let indice = j+(i*3);
            if(questions[indice] === undefined) break;
            if(answer_user[indice]!==undefined && answer_user[indice].correct)color="btn-success";
            else color="btn-danger";
            modalPage += `<div class="col">
            <button class="btn ${color} mt-3 btn-recap" id="${compteur}">Question ${compteur}</button>
        </div>`;
            compteur++;
        }
        modalPage +=`</div>`;
    }
    return modalPage;
}
function endGame(){
    Swal.fire({
        title: 'Récapitulatif des réponses',
        html: html_endGame(),
        width: 1000,
        padding: '3em',
        color: '#bf1139',
        scrollbarPadding: false,
        backdrop: `  rgba(80,80,80,0.7) `,
        allowOutsideClick : false,
        allowEscapeKey: false,
        confirmButtonText: 'Retour à la page d\'accueil',
        preConfirm: (login)=> {
            Redirect("/");
        }
    })
    let btnRecap = document.querySelectorAll(".btn-recap");
    btnRecap.forEach((recap)=>recap.addEventListener("click",showQuestionWithMyAnswer));
    let sal = document.getElementById('swal2-html-container');
    sal.style.overflow="visible";
}
// we change the question and the answer
async function questionSuivante(index){
    //recupération de mes questions depuis 1 quizz
    if(index>questions.length-1){
        console.log("plus de questions !!"); /// on va redigirer vers la page de fin de jeu ici
        flipAnswer();
        await endGame();
        return;
    }
    let Quest = document.getElementById('theQuestion');
    Quest.innerText=questions[index].question;

    //nb question
    const nbQuestion = document.getElementById('nbQuestion');
    nbQuestion.innerText=(index+1)+"/"+questions.length;

    //recuperation des reponses du quizz
    answers = await getAnswers(questions[index].id_question);
    console.log(answers);
    //mise des reponses dans html
    html_answer();
    let btnNext = document.getElementById('nextQuestion');
    btnNext.addEventListener("click", async e => {
        e.preventDefault();
        clearInterval(myInterval);
        restartCooldown();
        if(answer_user[position]===undefined) answer_user[position]="vide";
        await questionSuivante(++position);
    })

    let answerFlip = document.querySelectorAll(".cards__single");
    answerFlip.forEach((answer) => answer.addEventListener("click", saveAnswerUser));
}//fin question suivant

//restart the cooldown when the user click on the next question button
function restartCooldown(){
    bar.set(1); //restart progress bar
    bar.animate(0); //restart progress bar
    setDifficulty(difficulty);
    myInterval=setInterval(timer,1000);
}

function insertionAnswerBack(){
    for(let i=0; i<=3;i++){
        let string = `answer_`+(i+1);
        let getDivBack = document.getElementById(string);
        let color;
        let element = list_answer[i];
        if(element.correct)color="bg-success";
        else color="bg-danger";
        let divBack = `
                     <div class="answer p-5 mt-4 shadow p-3 container ${color} text-white" style="width: 70%;">
                        ${element.answer}
                    </div>
        `;
        getDivBack.innerHTML = divBack;
    }
}

//save answer user in the list answer_user
// this.children[1].id: it's to receive the id of the answer select
function saveAnswerUser(){
    if(answer_user[position]){ // cant change his answer !!
        flipAnswer();
        return;
    }

    let id = this.children[1].id;

    for(let i=1;i<=list_answer.length;i++){
        let id_tmp="answer_"+i;
        if(id===id_tmp){
            answer_user[position]=list_answer[i-1];
        }
    }
    console.log(this.children[1].id);
    console.log(position);
    console.log(answer_user);
    flipAnswer();
}
//we stop the cooldown here and the progress bar
// we add the the true result behind the choices because the user can see the answers with F12 with the function "insertionAnswerBack"
function flipAnswer(){
    if(answer_user[position]===undefined) answer_user[position]="vide";
    clearInterval(myInterval);
    bar.stop();
    insertionAnswerBack();
    let answers = document.querySelectorAll(".cards__single");
    for(const theAnswer of answers){
        theAnswer.classList.add("flip");
    }
}
function getDifficulty(id){
    if(id===1){
        return easy;
    }
    if(id===2){
        return medium;
    }
    else{
        return hard;
    }
}

function setDifficulty(id){
    if(id===1){
        decompte=30;
    }
    if(id===2){
        decompte=20;
    }
    if(id===3){
        decompte=10;
    }
}

async function GamePage(params) {
    console.log(params);
    if(params===undefined){
        Redirect("/");
        return;
    }
    myMain.innerHTML = myPage;
    //57
    difficulty=params[1];
    setDifficulty(difficulty);
    console.log(params);
    await getQuestions(params[0]);
    console.log(questions);
    insertProgressBar();
    timer();
    await questionSuivante(position);








}

export {GamePage};

