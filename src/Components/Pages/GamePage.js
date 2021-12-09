import ProgressBar from "progressbar.js";
"use strict";

const myMain = document.querySelector("main");
let easy=30000;
let medium=20000;
let hard=10000;
let position=0;
let list_answer = [];
let myPage = `<div id="page" class="container-fluid">
        <div id="bar-progress" class="row">
        </div>
        <div id="couldown" class="row justify-content-center h2 text-danger">
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
        const questions = await response.json();

        return questions;
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
        const answers = await response.json();

        return answers;
    } catch (err) {
        console.error("getAnswers::error: ", err);
    }
}

function insertProgressBar(){
    //Bar
    let divBar = document.getElementById('bar-progress');
    let bar = new ProgressBar.Line(divBar, {
        strokeWidth: 4,
        easing: 'linear',
        duration: easy,
        color: '#FFEA82',
        svgStyle: {width: '100%', height: '25px'},
    });
    let pc = 1;
    bar.set(pc);  // Number from 0.0 to 1.0
    bar.animate(0);
}

function timer(){
    //countdown
    let decompte=30;
    let timer = function (){
        if(decompte===0) clearInterval(countdown());
        const cool = document.getElementById('couldown');
        decompte-=1;
        cool.innerText=decompte;
        return decompte;
    }
    let test = setInterval(timer,1000);
}

function html_answer(answers){
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

async function questionSuivante(id_quizz,index){
    //recupération de mes questions depuis 1 quizz
    let questions = await getQuestions(id_quizz);
    let Quest = document.getElementById('theQuestion');
    Quest.innerText=questions[index].question;

    //nb question
    const nbQuestion = document.getElementById('nbQuestion');
    nbQuestion.innerText=(index+1)+"/"+questions.length;

    //recuperation des reponses du quizz
    let answers = await getAnswers(questions[index].id_question);

    //mise des reponses dans html
    html_answer(answers);
    let btnNext = document.getElementById('nextQuestion');
    btnNext.addEventListener("click", async e => {
        e.preventDefault();
        await questionSuivante(41,++position);
    })

    let answerFlip = document.querySelectorAll(".cards__single");
    answerFlip.forEach((answer) => answer.addEventListener("click", flipAnswer));
}//fin question suivant

function insertionAnswer(){
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

function flipAnswer(){
    insertionAnswer();
    let answers = document.querySelectorAll(".cards__single");
    for(const theAnswer of answers){
        theAnswer.classList.toggle("flip");
    }
}

// async function zebi(){
//     await questionSuivante(41,++position)
// }

async function GamePage() {
    myMain.innerHTML = myPage;
    insertProgressBar();
    timer();
    await questionSuivante(41,position);








}

export {GamePage};

