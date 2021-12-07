let easy=30;
let medium=20;
let hard=10;


let myPage = `<div id="page" class="container-fluid">
        <div id="bar-progress" class="bg-info row">
        ---------------
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
                <div class="answer p-5 mt-4 border  bg-danger shadow p-3">
                    ANSWER 1
                </div>
            </div>
            <div class="row ">
                <div class="answer p-5  mt-4 border bg-success shadow p-3">
                    ANSWER 2
                </div>
            </div>
            <div class="row ">
                <div class="answer p-5 mt-4 border bg-danger shadow p-3">
                    ANSWER 3
                </div>
            </div>
            <div class="row ">
                <div class="answer p-5 mt-5 border bg-danger shadow p-3">
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

function GamePage() {
    const myMain = document.querySelector("main");
    myMain.innerHTML = myPage;
}

export {GamePage};

