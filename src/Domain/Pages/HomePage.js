const homePage = `
<div class="container">
    <div class="row">
        <h4>Les tendances</h4>
    </div>
    <div class="row">
        <div class="col">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title" id="quizz1">Quizz 1</h5>
                    <h6 class="card-subtitle mb-2 text-muted" id="creator1">par xX_Mehdi_Xx</h6>
                    <p class="card-text">Petite description du quizz 1</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" type="button">Jouer</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title" id="quizz2">Quizz 2</h5>
                    <h6 class="card-subtitle mb-2 text-muted" id="creator2">par Rayandu23</h6>
                    <p class="card-text">Petite description du quizz 2.</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" type="button">Jouer</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title" id="quizz3">Quizz 3</h5>
                    <h6 class="card-subtitle mb-2 text-muted" id="creator3">par StefanBxl</h6>
                    <p class="card-text">Petite description du quizz 3.</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" type="button">Jouer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <h4>Explorer</h4>
    </div>
    <div class="row">
        <div class="col">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Quizz 1</h5>
                    <h6 class="card-subtitle mb-2 text-muted">par xX_Mehdi_Xx</h6>
                    <p class="card-text">Petite description du quizz 1</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" type="button">Jouer</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Quizz 2</h5>
                    <h6 class="card-subtitle mb-2 text-muted">par Rayandu23</h6>
                    <p class="card-text">Petite description du quizz 2.</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" type="button">Jouer</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Quizz 3</h5>
                    <h6 class="card-subtitle mb-2 text-muted">par StefanBxl</h6>
                    <p class="card-text">Petite description du quizz 3.</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" type="button">Jouer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;

const HomePage = async () => {
  /*
  let user = getSessionObject("user");
  if (!user) {
        Redirect("/RegisterAndLoginPage");
  }*/
  const main = document.querySelector("main");
  main.innerHTML = homePage;
  const response = await fetch("/api/quizz/");
  const allQuizz = await response.json();
  let titre_quizz;
  let createur_quizz;
  let id;
  let indice;
  let creator;
  for(let i=0; i < 3 ; i++){ // < allQuizz.length
    indice = i+1;
    // Nom du quizz
    id = 'quizz'+indice;
    titre_quizz = document.getElementById(id);
    titre_quizz.innerText = allQuizz[i].name;
    
    // Créateur du quizz
    id = "creator"+indice;
    createur_quizz =document.getElementById(id);
    creator = await fetch("/api/users/"+allQuizz[i].id_creator);
    creator = await creator.json();
    createur_quizz.innerHTML = "par "+ creator.name;
  }  
};

export default HomePage;