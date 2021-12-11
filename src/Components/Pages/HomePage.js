import { getSessionObject } from "../../utils/session";
import { RedirectWithParams } from "../Router/Router";
let main;
let divPage;
//TODO : avoir plusieurs pages au lieu d'un scroll infini
const HomePage = async () => {
  let idUser = await (await fetch("/api/users/email/"+getSessionObject("user").email)).json();
  console.log(idUser);
  main = document.querySelector("main");
  main.innerHTML = " "; // on reinitialise le main

  divPage = document.createElement("div");
  divPage.className = "container-fluid";
  divPage.id = "HomePageId";
  main.appendChild(divPage);

  // Titre de la page
  let containerSquizzGame = document.createElement("div");
  containerSquizzGame.className = "container-fluid my-5 text-center text-danger";
  let titleSquizzGame = document.createElement("h1");
  titleSquizzGame.innerHTML = "sQuizzGame";
  containerSquizzGame.appendChild(titleSquizzGame);
  divPage.appendChild(containerSquizzGame);


  let container = document.createElement("div");
  container.className = "container";

  // Sous-Titre Tendances
  let tendances = document.createElement("div")
  tendances.className = "container";
  let tendances_title = document.createElement("h4");
  tendances_title.innerHTML = "Tendances";
  tendances.appendChild(tendances_title);
  divPage.appendChild(tendances);

  let allQuizzTendances = await fetch("/api/quizz/mostliked");
  allQuizzTendances = await allQuizzTendances.json();
  // Si il n'y a pas de quizz en tendances
  if(allQuizzTendances.length == 0){
    let messageP = document.createElement("p");
    messageP.innerHTML = "Pas de quizz en tendances pour le moment ...";
    tendances.appendChild(messageP);
  }
  else{
    afficherQuizz(allQuizzTendances);
  }


  // Sous-Titre Abonnements
  let abonnements = document.createElement("div")
  abonnements.className = "container";
  let abonnements_title = document.createElement("h4");
  abonnements_title.innerHTML = "Abonnements";
  abonnements.appendChild(abonnements_title);
  divPage.appendChild(abonnements);
  
  let allQuizzAbonnements = await fetch("/api/quizz/abonnements/"+idUser.id_user);
  allQuizzAbonnements = await allQuizzAbonnements.json();
  
  // Si il n'y a pas de quizz dans les abonnements
  if(allQuizzAbonnements.length == 0){
    let messageP = document.createElement("p");
    messageP.innerHTML = "Pas de quizz dans les abonnements pour le moment ...";
    abonnements.appendChild(messageP);
  }
  else{
    afficherQuizz(allQuizzAbonnements);
  }


  // Sous-Titre Explorer
  let explorer = document.createElement("div")
  explorer.className = "container";
  let explorer_title = document.createElement("h4");
  explorer_title.innerHTML = "Explorer";
  explorer.appendChild(explorer_title);
  divPage.appendChild(explorer);

  let allQuizz = await fetch("/api/quizz/");
  allQuizz = await allQuizz.json();
  afficherQuizz(allQuizz);
};


async function afficherQuizz(allQuizz){
   // Créer une row
   for(let j = 0; j < allQuizz.length/3; j++){
    let container3Q = document.createElement("div");
    container3Q.className = "container my-5"
    divPage.appendChild(container3Q);
    let row3Q = document.createElement("div");
    row3Q.className = "row";
    container3Q.appendChild(row3Q);
    for(let i=0; i <  3; i++){ 
        let indice = i+(j*3);
        let col = document.createElement("div");
        col.className = "col-sm-4";
        row3Q.appendChild(col);
        if(allQuizz[indice] == undefined) break;
        

        // Création de la card quizz
        let divCard = document.createElement("div");
        divCard.className = 'card';
        let div = document.createElement("div");
        div.className = 'card-body';
        divCard.appendChild(div);
        col.appendChild(divCard);
        
        // Nom du quizz
        let title = document.createElement("h5");
        title.className = 'card-title';
        let titleTexte = allQuizz[indice].name;
        // Tronquage du titre du quizz si il est trop long
        if(titleTexte.length > 25){
          titleTexte = titleTexte.substring(0, 25);
          titleTexte += " ...";
        }
        title.innerHTML = titleTexte;

        div.appendChild(title);
        
        // Créateur du quizz
        let creator = allQuizz[indice].user_name;
        let subtitle = document.createElement("h6");
        subtitle.className = "card-subtitle mb-2 text-muted";
        subtitle.innerHTML = "par "+creator;
        div.appendChild(subtitle);
            
        // Description du quizz
        let description = document.createElement("p");
        description.className = "card-text";
        let descriptionTexte = allQuizz[indice].description;

        // Tronquage de la description si elle est trop longue
        if(descriptionTexte.length > 40){
          descriptionTexte = descriptionTexte.substring(0, 40);
          descriptionTexte += " ...";
        }
        description.innerHTML = descriptionTexte;
        div.appendChild(description);
        
        // Bouton pour jouer au quizz
        let divButton = document.createElement("div");
        divButton.className = "d-grid gap-2";
        let buttonPlay = document.createElement("button");
        buttonPlay.className = "btn btn-primary btnJouer";
        buttonPlay.type = "button";
        buttonPlay.innerHTML = "Jouer";
        buttonPlay.addEventListener("click", redirectionQuizzPage);
        buttonPlay.id = allQuizz[indice].id_quizz;
        div.appendChild(buttonPlay);
    } 
  }  
}

async function redirectionQuizzPage(e){
  e.preventDefault();
  RedirectWithParams("/Quizz",this.id);
}

export default HomePage;