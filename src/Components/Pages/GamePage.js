import ProgressBar from "progressbar.js";
"use strict";
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
                1/15
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

const myMain = document.querySelector("main");
let easy=30000;
let medium=20000;
let hard=10000;
async function GamePage() {
    myMain.innerHTML = myPage;
    insertProgressBar();
    timer();

    //recupération de mes questions depuis 1 quizz
    let questions = await getQuestions(3);
    let Quest = document.getElementById('theQuestion');
    Quest.innerText=questions[0].question;

    //recuperation des reponses du quizz
    const divAnswer= document.getElementById('answers');
    let answers = await getAnswers(questions[0].id_question);

    //nb question
    const nbQuestion = document.getElementById('nbQuestion');
    nbQuestion.innerText=1+"/"+questions.length;

    //mise des reponses dans html
    let html_answer="";
    for (const element of answers) {
        html_answer += `
                    <div class="row">
                <div class="answer p-5 mt-4 shadow p-3 container bg-dark text-white" style="width: 70%;">
                    ${element.answer}
                </div>
            </div>
        `;
        answers.in
    }
    html_answer +=`
                <div class="row">
                <div class="progress mt-5">
                    <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                </div>
            </div>

            <button class="btn btn-primary mt-5" type="submit">Question suivante</button>
    `;
    divAnswer.innerHTML = html_answer;
}

export {GamePage};

