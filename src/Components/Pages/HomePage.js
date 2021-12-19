import { getSessionObject } from "../../utils/session";
import { RedirectWithParams,RedirectWithParamsInUrl } from "../Router/Router";
const escape = require("escape-html");
import refreshIcon from "../../img/refresh.png";

const HomePage = async () => {
  let div_page = document.createElement("div");
  let main = document.querySelector("main");
  main.innerHTML = "";  // on reinitialise le main
  div_page.innerHTML = ""; // on reinitialise la div_home_page

  // Ajout du titre de la page
  let container_title_page = document.createElement("div");
  container_title_page.className = "container-fluid my-5 text-center text-danger";
  let title_page = document.createElement("h1");
  title_page.innerHTML = "sQuizzGame";
  container_title_page.appendChild(title_page);
  main.appendChild(container_title_page);

  //Création du container qui va contenir quasi toute la page
  div_page = document.createElement("div");
  div_page.className = "container-fluid";
  div_page.id = "HomePageId";

  // Ajout de la barre de recherche
  boutonRecherche(main, div_page);
  
  main.appendChild(div_page);

  // Sous-Titre Tendances
  creerSousTitre("Tendances",div_page);
  try{
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getSessionObject("user").token
      },
    };

    let reponse = await fetch("/api/quizz/mostliked",options);
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
      message.className = "m-5";
      let tendances = document.getElementById("titre_Tendances");
      tendances.appendChild(message);
    }
    else{
      afficherQuizz(all_quizz_tendances, div_page);
    }
  } catch (err) {
    console.error("getTendances::error: ", err);
  }
  
  // Sous-Titre Abonnements
  creerSousTitre("Abonnements", div_page);

  let id_user = getSessionObject("user").id_user;
  try{
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getSessionObject("user").token
      },
    };

    let reponse = await fetch("/api/quizz/abonnements/"+id_user, options);
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
      message.className = "m-5";
      let abonnements = document.getElementById("titre_Abonnements");
      // pour gérer le cas où l'utilisateur spamme le bouton Home, on ne duplique pas le message suivant
      if(abonnements != null && !abonnements.innerHTML.includes("Pas de quizz dans les abonnements pour le moment ...")) abonnements.appendChild(message); 
    }
    else{
      afficherQuizz(all_quizz_abonnements, div_page);
    }
  }catch (err) {
    console.error("getAbonnements::error: ", err);
  }


  // Sous-Titre Explorer
  creerSousTitre("Explorer", div_page);
  fetchExplorer(div_page);
}

/**
 * Crée et ajoute à la page un sous titre
 * @param {string} nom_sous_titre le nom du sous titre
 * @param {object} div_page la div à laquelle on ajoutera le sous titre
 */
async function creerSousTitre(nom_sous_titre, div_page){
  //Création du container 
  let div_sous_titre = document.createElement("div");
  div_sous_titre.className = "container";
  div_sous_titre.id = "titre_"+nom_sous_titre;

  //Création du sous-titre
  let sous_titre = document.createElement("h4");
  sous_titre.innerHTML = nom_sous_titre+"   ";
  sous_titre.className = "m-5";
  
  // Si c'est l'explorer on ajoutera un btn
  if(nom_sous_titre === "Explorer"){
    // Ajout du bouton pour actualiser l'explorer
    let refresh_btn = document.createElement("img");
    refresh_btn.src = refreshIcon;
    refresh_btn.alt = "bouton pour actualiser les quizz dans explorer";
    refresh_btn.id = "refresh_btn";
    refresh_btn.addEventListener("click", async (e) => {
      for(let i=0; i < 3; i++){
        div_page.removeChild(document.getElementsByClassName("container my-3 Explorer")[0]);
      }
      fetchExplorer(div_page);
      
    })
    sous_titre.appendChild(refresh_btn);
  }
  div_sous_titre.appendChild(sous_titre);
  div_page.appendChild(div_sous_titre);
}

/**
 * Fais un fetch pour obtenir les quizz explorer et les affiche
 * @param {object} div_page la div à laquelle on ajoutera le sous titre
 */
async function fetchExplorer(div_page){
  try{
    const options = {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        Authorization: getSessionObject("user").token
      },
    };
    let reponse = await fetch("/api/quizz/explorer", options);
    if (!reponse.ok) {
      throw new Error(
        "fetch error : " + reponse.status + " : " + reponse.statusText
      );
    }
    let all_quizz_explorer = await reponse.json();
    afficherQuizz(all_quizz_explorer, div_page, true);
  }catch (err) {
    console.error("getExplorer::error: ", err);
  }
}

/**
 * Affiche tous les quizz
 * @param {object} all_quizz les quizz à afficher
 * @param {object} div_page  la div à laquelle on ajoutera le sous titre
 * @param {boolean} isExplorer pour savoir si il s'agit des quizz explorer
 */
function afficherQuizz(all_quizz, div_page, isExplorer=false){
   // Créer une row
   for(let j = 0; j < all_quizz.length/3; j++){
    let container_3Q = document.createElement("div");
    if(isExplorer)container_3Q.className = "container my-3 Explorer";
    else container_3Q.className = "container my-3";
    div_page.appendChild(container_3Q);
    let row_3Q = document.createElement("div");
    row_3Q.className = "row";
    container_3Q.appendChild(row_3Q);
    // Créer et affiche une rangée de 3 quizz
    for(let i=0; i <  3; i++){ 
        let indice = i+(j*3);
        let col = document.createElement("div");
        col.className = "col-sm-4";
        row_3Q.appendChild(col);
        if(all_quizz[indice] == undefined) break;

        // Création de la card quizz
        let div_card = document.createElement("div");
        div_card.className = 'card m-3';
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
        let subtitle = document.createElement("a");
        subtitle.className = "card-subtitle mb-2 text-muted";
        subtitle.innerHTML = "par "+creator;
        subtitle.addEventListener("click", async (e) => {
          e.preventDefault();
          let elementId = all_quizz[indice].id_creator;
          RedirectWithParamsInUrl("/Profil","?idUser="+elementId);
        });
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

/**
 * Redirige vers la page du quizz en question
 */
function redirectionQuizzPage(){
  RedirectWithParams("/Quizz",this.id);
}

/***************************************************************************************
*    Title: search box | HTML & CSS
*    Author: GeekBase
*    Date: 9/12/21
*    Code version: see the table below
*    Availability: https://www.youtube.com/watch?v=csY6KW7cIUM
***************************************************************************************/
/**
 * Créer la barre de recherche
 * @param {object} main 
 * @param {object} div_page 
 */
async function boutonRecherche(main, div_page){
  //Ajout de la barre de recherche
  main.innerHTML += `<div class="boxContainer">
                          <table class="elementsContainer">
                            <tr>
                              <td>
                                <input type="text" placeholder="Rechercher" class="search" name="searchBar" id="searchBar" >
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
    if(e.key === "Enter") await rechercherQuizz(div_page);
  });
  // Quand on appuye sur la loupe on lance la recherche
  let search = main.querySelector("#searchButton");
  search.addEventListener("click", async (e) => {
    e.preventDefault();
    await rechercherQuizz(div_page);
  });
}

/**
 * Effectue une recherche sur les quizz
 * @param {object} div_page  la div à laquelle on ajoutera le sous titre 
 */
async function rechercherQuizz(div_page){
  //Si l'utilisateur entre un champs vide, il reste sur la HomePage
  if(document.getElementById("searchBar").value.replace(/\s+/g, '') === '') return;
  div_page.innerHTML = "";
  let critere = escape(document.getElementById("searchBar").value);
  try{
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getSessionObject("user").token
      },
    };
    let reponse = await fetch("/api/quizz/recherche/"+critere, options);
    if (!reponse.ok) {
      throw new Error(
        "fetch error : " + reponse.status + " : " + reponse.statusText
      );
    }
    let all_quizz_recherche = await reponse.json();
    let div_container_res = document.createElement("div");
    div_container_res.className = "container";
    let message_resultat = document.createElement("h4");
    div_container_res.appendChild(message_resultat);
    div_page.appendChild(div_container_res);
    //Si on a pas de résultat
    if(all_quizz_recherche.length === 0){
      message_resultat.innerHTML = "Pas de résultat pour la recherche : "+critere;
    }
    else{
      message_resultat.innerHTML = "Résultat pour la recherche : "+critere;
      afficherQuizz(all_quizz_recherche, div_page);
    }
    
  }catch (err) {
    console.error("getRecherche::error: ", err);
  }
}

export default HomePage;