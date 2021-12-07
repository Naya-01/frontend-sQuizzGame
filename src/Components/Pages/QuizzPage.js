import thumb from "../../img/thumb.png";


let myPage = `<div class="container">
        <h1 class="text-center">Quizz BLOC 1</h1>
        <div class="row">
            <div class="col text-start"><a class="fs-3 btn btn-light text-dark rounded rounded-pill
             border border-dark border-2 border creator-size">Créer par : <span class="">Mehdi</span></a></div>
            <div class="col text-end">
                <button type="submit" name="button_like" class="fs-1 bg-transparent btn btn-lg shadow-none text-dark text-decoration-none" value="63">
                    <img src="${thumb}" width="60" alt="vote" class="img-fluid thumb">67
                </button>
            </div>
        </div>
        <div class="row mb-5">
            <div class="col-3"></div>
            <div class="col-6">
                <h2 class="text-center">Bienvenue sur mon quizz !</h2>
                <p class="fs-4 text-center"> Ce quizz aura pour but de tester vos connaisances en adéquation avec ce que vous aurez vu lors de votre cursus en bloc 1. J'espère que apprendez plein de chose en y jouant !</p>
                <p class="fs-4 text-center">Amusez-vous bien 😁</p>
            </div>
            <div class="col-lg-3"></div>
        </div>


<div class="row">
        <!--  Meilleurs Scores   -->
        <div class="col">
            <div class="row m-auto">
                <span class="fs-3 btn btn-light text-dark
                    border border-dark border-2 border">Meilleurs scores</span>
            </div>
            <div class="row mt-3">
                <div class="col-4">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 margin-right-scores scores-size">1</span>
                    </div>
                </div>
                <div class="col-8">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 score">Mehdi | 15.000</span>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-4">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 margin-right-scores scores-size">2</span>
                    </div>
                </div>
                <div class="col-8">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 score">Nicolas | 12.000</span>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-4">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 margin-right-scores scores-size">3</span>
                    </div>
                </div>
                <div class="col-8">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 score">Stefan | 3.600</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Millieu -->

        <div class="col">
            <div class="row mb-2 mt-5">
                <div class="col mb-2">
                    <div>
                        <span class="btn cursor btn-light text-white
                        border border-dark border-2 border rounded rounded-pill bg-success fs-4">Facile</span>
                    </div>
                </div>
                <div class="col">
                    <div>
                        <span class="btn cursor btn-light text-white
                        border border-dark border-2 border rounded rounded-pill bg-warning fs-4">Moyen</span>
                    </div>
                </div>
                <div class="col">
                    <div>
                        <span class="btn cursor btn-light text-white
                        border border-dark border-2 border rounded rounded-pill bg-danger fs-4">Difficile</span>
                    </div>
                </div>
            </div>

            <div class="row m-auto mb-5">
                <button class="btn btn-light btn-lg text-dark
                border border-dark border-2 border fs-4">Commencer le Quizz</button>
            </div>
        </div>
        

        <!-- Scores Personnels-->
        <div class="col">
            <div class="row m-auto">
                <span class="fs-3 btn btn-light text-dark
                    border border-dark border-2 border">Mes meilleurs scores</span>
            </div>
            <div class="row mt-3">
                <div class="col-4">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 margin-right-scores scores-size">Moyen</span>
                    </div>
                </div>
                <div class="col-8">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 score">12.847</span>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-4">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 margin-right-scores scores-size">Facile</span>
                    </div>
                </div>
                <div class="col-8">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 score">10.867</span>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-4">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 margin-right-scores scores-size">Difficile</span>
                    </div>
                </div>
                <div class="col-8">
                    <div>
                        <span class="btn btn-light text-dark
                        border border-dark border-2 border fs-4 score">2.617</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>`;

function QuizzPage() {
    const myMain = document.querySelector("main");
    myMain.innerHTML = myPage;
}

export {QuizzPage};
