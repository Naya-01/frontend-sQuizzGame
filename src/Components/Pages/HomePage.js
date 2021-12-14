import { getSessionObject } from "../../utils/session";
import { RedirectWithParams } from "../Router/Router";
const escape = require("escape-html");
let main;
let div_page;

//TODO : avoir plusieurs pages au lieu d'un scroll infini
const HomePage = async () => {
  
  main = document.querySelector("main");
  //TODO : supprimer le fais que en spammant ça duplique
  
  main.innerHTML = "";  // on reinitialise le main

  // Ajout du titre de la page
  let container_title_page = document.createElement("div");
  container_title_page.className = "container-fluid my-5 text-center text-danger";
  let title_page = document.createElement("h1");
  title_page.innerHTML = "sQuizzGame";
  container_title_page.appendChild(title_page);
  main.appendChild(container_title_page);

  // Ajout de la barre de recherche
  boutonRecherche();

  //Création du container qui va contenir quasi toute la page
  div_page = document.createElement("div");
  div_page.className = "container-fluid";
  div_page.id = "HomePageId";
  main.appendChild(div_page);

  // Sous-Titre Tendances
  creerSousTitre("Tendances");
  try{
    let reponse = await fetch("/api/quizz/mostliked");
    if (!reponse.ok) {
      throw new Error(
        "fetch error : " + reponse.status + " : " + reponse.statusText
      );
    }
    let all_quizz_tendances = await reponse.json();
    // Si il n'y a pas de quizz en tendances
    if(all_quizz_tendances.length == 0){
      let message = document.createElement("p");
      message.innerHTML = "Pas de quizz en tendances pour le moment ...";
      let tendances = document.getElementById("titre_Tendances");
      tendances.appendChild(message);
    }
    else{
      afficherQuizz(all_quizz_tendances);
    }
  } catch (err) {
    console.error("getTendances::error: ", err);
  }
  


  // Sous-Titre Abonnements
  creerSousTitre("Abonnements");

  let id_user = getSessionObject("user").id_user;
  try{
    let reponse = await fetch("/api/quizz/abonnements/"+id_user);
    if (!reponse.ok) {
      throw new Error(
        "fetch error : " + reponse.status + " : " + reponse.statusText
      );
    }

    let all_quizz_abonnements = await reponse.json();
    
    // Si il n'y a pas de quizz dans les abonnements
    if(all_quizz_abonnements.length == 0){
      let message = document.createElement("p");
      message.innerHTML = "Pas de quizz dans les abonnements pour le moment ...";
      console.log("oklm");
      let abonnements = document.getElementById("titre_Abonnements");
      abonnements.appendChild(message);
    }
    else{
      afficherQuizz(all_quizz_abonnements);
    }
  }catch (err) {
    console.error("getAbonnements::error: ", err);
  }


  // Sous-Titre Explorer
  creerSousTitre("Explorer");
  try{
    let reponse = await fetch("/api/quizz/explorer");
    if (!reponse.ok) {
      throw new Error(
        "fetch error : " + reponse.status + " : " + reponse.statusText
      );
    }
    let all_quizz_explorer = await reponse.json();
    afficherQuizz(all_quizz_explorer);
  }catch (err) {
    console.error("getExplorer::error: ", err);
  }
};

async function creerSousTitre(nom_sous_titre){
  let div_sous_titre = document.createElement("div")
  div_sous_titre.className = "container ";
  div_sous_titre.id = "titre_"+nom_sous_titre;
  let sous_titre = document.createElement("h4");
  sous_titre.innerHTML = nom_sous_titre;
  div_sous_titre.appendChild(sous_titre);
  div_page.appendChild(div_sous_titre);
}

async function afficherQuizz(all_quizz){
   // Créer une row
   for(let j = 0; j < all_quizz.length/3; j++){
    let container_3Q = document.createElement("div");
    container_3Q.className = "container my-5"
    div_page.appendChild(container_3Q);
    let row_3Q = document.createElement("div");
    row_3Q.className = "row";
    container_3Q.appendChild(row_3Q);
    for(let i=0; i <  3; i++){ 
        let indice = i+(j*3);
        let col = document.createElement("div");
        col.className = "col-sm-4";
        row_3Q.appendChild(col);
        if(all_quizz[indice] == undefined) break;
        

        // Création de la card quizz
        let div_card = document.createElement("div");
        div_card.className = 'card';
        let div = document.createElement("div");
        div.className = 'card-body';
        div_card.appendChild(div);
        col.appendChild(div_card);
        
        // Nom du quizz
        let title = document.createElement("h5");
        title.className = 'card-title';
        let title_texte = all_quizz[indice].name;
        // Tronquage du titre du quizz si il est trop long
        if(title_texte.length > 25){
          title_texte = title_texte.substring(0, 25);
          title_texte += " ...";
        }
        title.innerHTML = title_texte;

        div.appendChild(title);
        
        // Créateur du quizz
        let creator = all_quizz[indice].user_name;
        let subtitle = document.createElement("h6");
        subtitle.className = "card-subtitle mb-2 text-muted";
        subtitle.innerHTML = "par "+creator;
        div.appendChild(subtitle);
            
        // Description du quizz
        let description = document.createElement("p");
        description.className = "card-text";
        let description_texte = all_quizz[indice].description;

        // Tronquage de la description si elle est trop longue
        if(description_texte.length > 60){
          description_texte = description_texte.substring(0, 60);
          description_texte += " ...";
        }
        description.innerHTML = description_texte;
        div.appendChild(description);
        
        // Bouton pour jouer au quizz
        let div_button = document.createElement("div");
        div_button.className = "d-grid gap-2";
        let button_play = document.createElement("button");
        button_play.className = "btn btn-primary btnJouer";
        button_play.type = "button";
        button_play.innerHTML = "Jouer";
        button_play.addEventListener("click", redirectionQuizzPage);
        button_play.id = all_quizz[indice].id_quizz;
        div.appendChild(button_play);
    } 
  }  
}

async function redirectionQuizzPage(e){
  e.preventDefault();
  RedirectWithParams("/Quizz",this.id);
}

async function boutonRecherche(){
  main.innerHTML += `<div class="boxContainer">
                          <table class="elementsContainer">
                            <tr>
                              <td>
                                <input type="text" placeholder="Chercher" class="search" name="searchBar" id="searchBar" >
                              </td>
                              <td>
                                <a href="#" id="searchButton">
                                  <span class="material-icons">search</span>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </div>`;

  // Quand on presse enter on lance la recherche
  let searchBar = main.querySelector("#searchBar");
  searchBar.addEventListener("keypress", async (e) => {
    if(e.key === "Enter") await rechercherQuizz();
  });

  let search = main.querySelector("#searchButton");
  search.addEventListener("click", async (e) => {
    e.preventDefault();
    await rechercherQuizz();
  });
}
async function rechercherQuizz(){
  //Si l'utilisateur entre un champs vide, il reste sur la HomePage
  if(document.getElementById("searchBar").value.replace(/\s+/g, '') === '') return;
  div_page.innerHTML = "";
  let critere = escape(document.getElementById("searchBar").value);
  try{
    let reponse = await fetch("/api/quizz/recherche/"+critere);
    if (!reponse.ok) {
      throw new Error(
        "fetch error : " + reponse.status + " : " + reponse.statusText
      );
    }
    let all_quizz_recherche = await reponse.json();
    let message_resultat = document.createElement("h4");
    div_page.appendChild(message_resultat);
    if(all_quizz_recherche.length === 0){
      message_resultat.innerHTML = "Pas de résultat pour la recherche : "+critere;
    }
    else{
      message_resultat.innerHTML = "Résultat pour la recherche : "+critere;
      afficherQuizz(all_quizz_recherche);
    }
    
  }catch (err) {
    console.error("getRecherche::error: ", err);
  }
}

export default HomePage;