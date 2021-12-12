import closeIcon from "../../img/croix.png";
import { Redirect } from "../Router/Router";
import { getSessionObject } from "../../utils/session";

const Swal = require('sweetalert2');

const escape = require("escape-html");

let nbQuestions;
let main ;
let formAllQuestions;
let containerNewQButton; 
let containerCreateButton;


const CreateQuizz = async () => {
  nbQuestions = 0;
  
  main = document.querySelector("main");
  main.innerHTML = " ";

  let divPage = document.createElement("div");
  divPage.className = "container-fluid";
  divPage.id = "CreateQuizzId";
  main.appendChild(divPage);
  formAllQuestions = document.createElement("form");
  containerNewQButton = document.createElement("div");

  //Ajout Titre de la page
  let createQuizzTitle = document.createElement("h1");
  createQuizzTitle.innerHTML = "Créer un quizz";
  let containerTitle = document.createElement("div");
  containerTitle.className = "container my-5 text-center text-danger";
  containerTitle.appendChild(createQuizzTitle);
  divPage.appendChild(containerTitle);

  // Ajout du titre du quizz
  let containerTitleQuizz = document.createElement("div");
  containerTitleQuizz.className = "container rounded-lg m-5 p-2";
  let divTitleQuizz = document.createElement("div");
  divTitleQuizz.className = "row";
  let titleQuizz = document.createElement("input");
  titleQuizz.type = "text";
  titleQuizz.id = "titleQuizz";
  titleQuizz.required = true;
  titleQuizz.placeholder = "Saisissez le titre du quizz";
  titleQuizz.className = "form-control";
  divTitleQuizz.appendChild(titleQuizz);
  let titleLabel = document.createElement("label");
  titleLabel.for = "titleQuizz";
  titleLabel.innerHTML = "Titre du Quizz : ";
  containerTitleQuizz.appendChild(titleLabel);
  containerTitleQuizz.appendChild(divTitleQuizz);
  let divErrorTitle = document.createElement("div");
  divErrorTitle.className = "row";
  let errorTitle = document.createElement("p");
  errorTitle.id = "errorTitle";
  divErrorTitle.appendChild(errorTitle);
  containerTitleQuizz.appendChild(divErrorTitle);
  formAllQuestions.appendChild(containerTitleQuizz);

  // Ajout description du quizz
  let containerDescQuizz = document.createElement("div");
  containerDescQuizz.className = "container rounded-lg m-5 p-2";
  let divDescQuizz = document.createElement("div");
  divDescQuizz.className = "row ";
  let descQuizz = document.createElement("textarea");
  descQuizz.row = "8";
  descQuizz.id = "descQuizz";
  descQuizz.required = true;
  descQuizz.placeholder = "Saisissez la description du quizz";
  descQuizz.className = "form-control";
  divDescQuizz.appendChild(descQuizz);
  let descLabel = document.createElement("label");
  descLabel.for = "descQuizz";
  descLabel.innerHTML = "Description du Quizz : ";
  containerDescQuizz.appendChild(descLabel);
  containerDescQuizz.appendChild(divDescQuizz);
  formAllQuestions.appendChild(containerDescQuizz);

  // Ajout d'une nouvelle question qui est là par défaut
  nouvelleQuestion();

  // Formulaire pour ajouter une question au quizz
  const newQuestionButton = document.createElement("input");
  containerNewQButton.className = "container-fluid my-3 text-center";
  newQuestionButton.id = "AjouterQuestion";
  newQuestionButton.value = "+ Nouvelle Question +";
  newQuestionButton.type = "button";
  newQuestionButton.className = "btn btn-primary";
  newQuestionButton.addEventListener("click", nouvelleQuestion);
  containerNewQButton.appendChild(newQuestionButton);
  formAllQuestions.appendChild(containerNewQButton);

  // Bouton pour creer un quizz
  containerCreateButton = document.createElement("div");
  containerCreateButton.className = "container-fluid text-center";
  const createQuizzButton = document.createElement("input");
  createQuizzButton.value = "Créer le quizz";
  createQuizzButton.type = "submit";
  createQuizzButton.className = "btn btn-primary";
  containerCreateButton.appendChild(createQuizzButton);
  formAllQuestions.appendChild(containerCreateButton);
  formAllQuestions.addEventListener("submit", soumettreQuizz);
  
  divPage.appendChild(formAllQuestions);  
};

async function soumettreQuizz(e){
  e.preventDefault();
  let erreur = 0;
  let titleQuizz = escape(document.getElementById("titleQuizz").value);
  if(titleQuizz.length > 150){
    document.getElementById("errorTitle").innerHTML = "Le titre est trop long";
    erreur++;
  }
  let descQuizz = escape(document.getElementById("descQuizz").value);
  let allQuestions = [];
  //Récupération des questions
  for(let i=0; i < nbQuestions; i++){
    let message = "enonceQ"+(i+1);
    let enonceQuestionN = escape(document.getElementById(message).value);// + (i+1));
    let answerA = escape(document.getElementById("reponseA" + (i+1)).value);
    let answerB = escape(document.getElementById("reponseB" + (i+1)).value);
    let answerC = escape(document.getElementById("reponseC" + (i+1)).value);
    let answerD = escape(document.getElementById("reponseD" + (i+1)).value);

    let idError = "errorQ"+(i+1);
    document.getElementById(idError).innerHTML = ""; // on reinitialise
    if(enonceQuestionN.length > 200){
      let errorQ = document.createElement("p");
      errorQ.innerHTML += "L'énonce est trop long.";
      document.getElementById(idError).appendChild(errorQ);
      erreur++;
    }
    if(answerA.length > 200){ 
      let errorQ = document.createElement("p");
      errorQ.innerHTML += "La réponse A est trop longue.";
      document.getElementById(idError).appendChild(errorQ);
      erreur++;    
    }
    if(answerB.length > 200){ 
      let errorQ = document.createElement("p");
      errorQ.innerHTML += "La réponse B est trop longue.";
      document.getElementById(idError).appendChild(errorQ);
      erreur++;
    }
    if(answerC.length > 200){ 
      let errorQ = document.createElement("p");
      errorQ.innerHTML += "La réponse C est trop longue.";
      document.getElementById(idError).appendChild(errorQ);
      erreur++;
    }
    if(answerD.length > 200){ 
      let errorQ = document.createElement("p");
      errorQ.innerHTML += "La réponse D est trop longue.";
      document.getElementById(idError).appendChild(errorQ);
      erreur++;
    }

    let aBool = false;
    let bBool = false;
    let cBool = false;
    let dBool = false;
    
    let radiosName = "radioBonneRep"+(i+1);
    let radiosBonneRep = document.getElementsByName(radiosName);
    for (let j = 0; j < radiosBonneRep.length; j++) {
      if (radiosBonneRep[j].checked) {
        switch(radiosBonneRep[j].value){
          case "A":
            aBool = true;
            break;
          case "B":
            bBool = true;
            break;
          case "C":
            cBool = true;
            break;
          case "D":
            dBool = true;
            break;
        }
        break;
      }
    }
    let newQuestion = {question: enonceQuestionN,
                        answers : [{answer:answerA, "correct":aBool},
                                   {answer:answerB, "correct":bBool},
                                   {answer:answerC, "correct":cBool},
                                   {answer:answerD, "correct":dBool}, ]};
    allQuestions[i] = newQuestion;
  }
  try{
    let options = {
      method: "POST",
      body: JSON.stringify({
        id_creator: getSessionObject("user").id_user,  
        name: titleQuizz,
        description: descQuizz,
        questions:  allQuestions,
      }), 
      headers: {
        "Content-Type": "application/json",
      },
    };
    if(erreur != 0 ) return;
    let reponse = await fetch("/api/quizz/", options);
    if (!reponse.ok) {
      throw new Error(
        "fetch error : " + reponse.status + " : " + reponse.statusText
      );
      }
  } catch (err) {
    console.error("createQuizz::error: ", err);
  }

  Redirect("/");
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    icon: 'success',
    title: 'Votre quizz a bien été créé.'
  })
  
}

/**
 * Création d'une nouvelle question
 * @param {*} e evenement
 */
async function nouvelleQuestion(e) {
  if (e != undefined) e.preventDefault();
  nbQuestions++;

  //Création du container
  let divContainer = document.createElement("div");
  divContainer.className = "container-fluid mr-5 my-3 text-center border bg-dark border-success rounded-lg p-2";
  divContainer.id = "containerQ"+nbQuestions;
  let divRowTitre = document.createElement("div");
  divRowTitre.className = "row m-3";

  //Ajout le numéro de la question
  let num = document.createElement("label");
  num.innerHTML = nbQuestions;
  num.id = "numQ"+nbQuestions;
  num.for = "enonceQ" + nbQuestions;
  let divColTitre1 = document.createElement("div");
  divColTitre1.className = "col-1";
  divColTitre1.appendChild(num);

  //Ajout titre de la question
  let enonceQuestion = document.createElement("input");
  enonceQuestion.type = "text";
  enonceQuestion.placeholder = "Saisissez votre question"
  enonceQuestion.id = "enonceQ" + nbQuestions;
  enonceQuestion.required = true;
  enonceQuestion.className = "form-control";
  let divColTitre2 = document.createElement("div");
  divColTitre2.className = "col-10";
  divColTitre2.appendChild(enonceQuestion);
  let divColTitre3 = document.createElement("div");

  // Ajout du bouton pour supprimer une question
  let closeImage = document.createElement("img");
  closeImage.src = closeIcon;
  closeImage.alt = "bouton pour supprimer une question"
  closeImage.id = "closeQ"+nbQuestions;
  closeImage.addEventListener("click", supprimerQuestion);
  divColTitre3.className = "col-1";
  divColTitre3.appendChild(closeImage);

  divRowTitre.appendChild(divColTitre1);
  divRowTitre.appendChild(divColTitre2);
  divRowTitre.appendChild(divColTitre3);

  // Réponses A et B
  let divRowAB = document.createElement("div");
  divRowAB.className = "row justify-content-around";
  let divColA = document.createElement("div");
  divColA.className = "col-1 m-auto";
  let divColA2 = document.createElement("div");
  divColA2.className = "col-5";
  createReponse(divColA,divColA2, "A");
  divRowAB.appendChild(divColA);
  divRowAB.appendChild(divColA2);
  let divColB = document.createElement("div");
  divColB.className = "col-1 m-auto";
  let divColB2 = document.createElement("div");
  divColB2.className = "col-5";
  createReponse(divColB,divColB2, "B");
  divRowAB.appendChild(divColB);
  divRowAB.appendChild(divColB2);

  

  // Réponses C et D
  let divRowCD = document.createElement("div");
  divRowCD.className = "row justify-content-around";
  let divColC = document.createElement("div");
  divColC.className = "col-1 m-auto";

  let divColC2 = document.createElement("div");
  divColC2.className = "col-5";

  createReponse(divColC,divColC2,"C");
  let divColD = document.createElement("div");
  divColD.className = "col-1 m-auto";
  let divColD2 = document.createElement("div");
  divColD2.className = "col-5";
  createReponse(divColD,divColD2,"D");
  divRowCD.appendChild(divColC);
  divRowCD.appendChild(divColC2);
  divRowCD.appendChild(divColD);
  divRowCD.appendChild(divColD2);
  
  divContainer.appendChild(divRowTitre);
  divContainer.appendChild(divRowAB);
  
  // TODO : A modifier le br
  let br = document.createElement("br")
  divContainer.appendChild(br);
  
  
  divContainer.appendChild(divRowCD);

  //Ajout de la div pour afficher l'erreur
  let divErrorQ = document.createElement("div");
  divErrorQ.className = "row mt-2";
  divErrorQ.id = "errorQ"+(nbQuestions);
  /*
  let errorQ = document.createElement("p");
  errorQ.id = "errorQ"+(nbQuestions);
  divErrorQ.appendChild(errorQ);
  */
  divContainer.appendChild(divErrorQ);


  if(e != undefined) formAllQuestions.insertBefore(divContainer, containerNewQButton);
  else formAllQuestions.appendChild(divContainer);
  console.log(nbQuestions);
  if(nbQuestions == 15) document.getElementById("AjouterQuestion").disabled = true; //ici
  
};

async function supprimerQuestion(e){
  e.preventDefault();
  //Cas où on essaye de supprimer une question alors qu'il y en a qu'une
  if(nbQuestions === 1) return;

  //On récupère celui qu'on doit supprimer
  let numQuestion = e.target.id.substring(6, 8);
  let nomContainerQuestion =  "containerQ"+numQuestion;

  //On le supprime
  formAllQuestions.removeChild(document.getElementById(nomContainerQuestion));
  
  //On convertis en entier
  numQuestion = parseInt(numQuestion, 10);

  //Cas où on supprime la dernière question
  if(numQuestion === nbQuestions) {
    nbQuestions --;
    if(nbQuestions == 14){
      document.getElementById("AjouterQuestion").disabled = false;
    }
    return;
  }

  //On décale tt les numeros des id
  while(numQuestion !== nbQuestions){
    let message = "containerQ"+(numQuestion+1);
    document.getElementById(message).id = "containerQ"+numQuestion;
    message = "enonceQ"+(numQuestion+1);
    document.getElementById(message).id = "enonceQ"+numQuestion;
    message = "numQ"+(numQuestion+1);
    document.getElementById(message).id = "numQ"+numQuestion;
    message = "numQ"+numQuestion;
    let element = document.getElementById(message);
    element.for = "enonceQ" + numQuestion;
    element.innerHTML = numQuestion;
    message = "closeQ"+(numQuestion+1);
    document.getElementById(message).id = "closeQ"+numQuestion;
    message = "errorQ"+(numQuestion+1);
    document.getElementById(message).id = "errorQ"+(numQuestion);

    let lettres = ["A","B","C","D"];
    // on change le name des radios button pour la bonne réponse
    message = "radioBonneRep"+(numQuestion+1);
    let radioBonneRepQNLN = document.getElementsByName(message);
    for(let h=0; h < lettres.length; h++){
      radioBonneRepQNLN[0].name = "radioBonneRep"+numQuestion;
    }

    // On change l'id des 4 reponses
    for(let i = 0; i < lettres.length; i++){
      message = "reponse"+lettres[i]+""+(numQuestion+1);
      document.getElementById(message).id = "reponse"+lettres[i]+""+numQuestion;
    }


    numQuestion ++;
  }
  nbQuestions --;

  //On rend le bouton Nouvelle question à nouveau cliquable
  if(nbQuestions == 14){
    document.getElementById("AjouterQuestion").disabled = false;
  }
}

async function createReponse(divCol,divCol2, lettre){
  let reponseN = document.createElement("input");
  reponseN.type = "text";
  reponseN.id = "reponse"+lettre+ "" + nbQuestions;
  reponseN.required = true;
  reponseN.placeholder = "Saisissez la réponse "+lettre;
  reponseN.className = "form-control";

  let bonneReponse = document.createElement("input");
  bonneReponse.type = "radio"
  bonneReponse.value = lettre;
  bonneReponse.name = "radioBonneRep"+nbQuestions;
  bonneReponse.id = "radioBonneRep"+nbQuestions+""+lettre;
  bonneReponse.className = "form-check-input";
  if(lettre === "A") bonneReponse.checked = true;

  divCol.appendChild(bonneReponse);
  divCol2.appendChild(reponseN);
  
};

export default CreateQuizz;
