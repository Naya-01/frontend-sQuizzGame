import ProgressBar from "progressbar.js";
"use strict";
let myPage = `<div id="page" class="container-fluid">
        <div id="bar-progress" class="row">
        </div>
        <div id="couldown" class="bg-success row justify-content-center">
        24h
        </div>

        <div id="diff-question-pos" class="container-md  pt-5">
            <div class="row header-question align-items-center text-center">
                <div class="col-sm-3">
                    easy
                </div>
                <div class="col-sm-6">
                    <p class="h2">Les pommes sont de quelle couleur ?</p>
                </div>
                <div class="col-sm-3">
                1/15
                </div>

            </div>

        </div>


        <div id="answers" class="container-md text-center">
            <div class="row">
                <div class="answer p-5 mt-4 bg-danger shadow p-3 container" style="width: 70%;">
                    ANSWER 1
                </div>
            </div>
            <div class="row ">
                <div class="answer p-5  mt-4 bg-success shadow p-3 container" style="width: 70%;">
                    ANSWER 2
                </div>
            </div>
            <div class="row ">
                <div class="answer p-5 mt-4 bg-danger shadow p-3 container" style="width: 70%;">
                    ANSWER 3
                </div>
            </div>
            <div class="row ">
                <div class="answer p-5 mt-4 bg-danger shadow p-3 container" style="width: 70%;">
                    ANSWER 4
                </div>
            </div>

            <div class="row">
                <div class="progress mt-5">
                    <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                </div>
            </div>

            <button class="btn btn-primary mt-5" type="submit">Question suivante</button>

        </div>



    </div>`;

let easy=3000;
let medium=2000;
let hard=1000;


function GamePage() {
    const myMain = document.querySelector("main");
    myMain.innerHTML = myPage;

    //Bar
    let divBar = document.getElementById('bar-progress');
    let bar = new ProgressBar.Line(divBar, {
        strokeWidth: 4,
        easing: 'linear',
        duration: 3000,
        color: '#FFEA82',
        svgStyle: {width: '100%', height: '25px'},
    });
    let pc =1;
    bar.set(pc);  // Number from 0.0 to 1.0
    bar.animate(0);



}

export {GamePage};

