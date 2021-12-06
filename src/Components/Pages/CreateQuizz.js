let nbQuestions = 0;
const main = document.querySelector("main");
const formAllQuestions = document.createElement("form");
const formNvQuestion = document.createElement("form");


let containerNewQButton = document.createElement("div");


const CreateQuizz = async () => {
  /*
  let user = getSessionObject("user");
  if (!user) {
        Redirect("/RegisterAndLoginPage");
  }*/

  // Titre de la page
  main.innerHTML = "";
  let createQuizzTitle = document.createElement("h4");
  createQuizzTitle.innerHTML = "Créer un quizz";
  main.appendChild(createQuizzTitle);

  // Ajout du titre du quizz
  let containerTitleQuizz = document.createElement("div");
  containerTitleQuizz.className = "container";
  let divTitleQuizz = document.createElement("div");
  divTitleQuizz.className = "row";
  let titleQuizz = document.createElement("input");
  titleQuizz.type = "text";
  titleQuizz.id = "titleQuizz";
  titleQuizz.required = true;
  titleQuizz.placeholder = "Saisissez le titre du quizz";
  divTitleQuizz.appendChild(titleQuizz);
  let titleLabel = document.createElement("label");
  titleLabel.for = "titleQuizz";
  titleLabel.innerHTML = "Titre du Quizz : ";
  containerTitleQuizz.appendChild(titleLabel);
  containerTitleQuizz.appendChild(divTitleQuizz);
  formAllQuestions.appendChild(containerTitleQuizz);

  // Ajout description du quizz
  let containerDescQuizz = document.createElement("div");
  containerDescQuizz.className = "container";
  let divDescQuizz = document.createElement("div");
  divDescQuizz.className = "row";
  let descQuizz = document.createElement("input");
  descQuizz.type = "text";
  descQuizz.id = "descQuizz";
  descQuizz.required = true;
  descQuizz.placeholder = "Saisissez la description du quizz";
  divDescQuizz.appendChild(descQuizz);
  let descLabel = document.createElement("label");
  descLabel.for = "descQuizz";
  descLabel.innerHTML = "Description du Quizz : ";
  containerDescQuizz.appendChild(descLabel);
  containerDescQuizz.appendChild(divDescQuizz);
  formAllQuestions.appendChild(containerDescQuizz);



  nouvelleQuestion();
  main.appendChild(formAllQuestions);
  main.appendChild(formNvQuestion);
  

  // Formulaire pour ajouter une question au quizz
  const newQuestionButton = document.createElement("input");
  containerNewQButton.className = "row";
  newQuestionButton.value = "+ Nouvelle Question +";
  newQuestionButton.type = "button";
  newQuestionButton.className = "btn btn-primary";
  newQuestionButton.addEventListener("click", nouvelleQuestion);
  containerNewQButton.appendChild(newQuestionButton);
  formAllQuestions.appendChild(containerNewQButton);
  

  // Bouton pour creer un quizz
  let containerCreateButton = document.createElement("div");
  containerCreateButton.className = "row";
  const createQuizzButton = document.createElement("input");
  createQuizzButton.value = "Créer le quizz";
  createQuizzButton.type = "submit";
  createQuizzButton.className = "btn btn-primary";
  containerCreateButton.appendChild(createQuizzButton);
  formAllQuestions.appendChild(containerCreateButton);
  formAllQuestions.addEventListener("submit", soumettreQuizz);
  
  
  
};

async function soumettreQuizz(e){
  e.preventDefault();
  
  let titleQuizz = document.getElementById("titleQuizz").value;
  let descQuizz = document.getElementById("descQuizz").value;
  let allQuestions = [];
  //Récupération des questions
  for(let i=0; i < nbQuestions; i++){
    let message = "enonceQ"+(i+1);
    let enonceQuestionN = document.getElementById(message);// + (i+1));
    console.log(enonceQuestionN);
    console.log("enonceQ" + (i+1));
    let answerA = document.getElementById("reponseA" + (i+1));
    let answerB = document.getElementById("reponseB" + (i+1));
    let answerC = document.getElementById("reponseC" + (i+1));
    let answerD =document.getElementById("reponseD" + (i+1));

    let aBool = false;
    let bBool = false;
    let cBool = false;
    let dBool = false;
    
    let radiosBonneRep = document.getElementsByName('radioBonneRep');
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
    let newQuestion = {question: enonceQuestionN.value,
                        answers : [{answer:answerA.value, "correct":aBool},
                                   {answer:answerB.value, "correct":bBool},
                                   {answer:answerC.value, "correct":cBool},
                                   {answer:answerD.value, "correct":dBool}, ]};
    allQuestions[i] = newQuestion;
  }

  //getSessionObject;
  let options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify({
      id_creator: 1,  //TODO : modifier en récupérant le id dans le cookie
      name: titleQuizz,
      description: descQuizz,
      questions:  allQuestions,
    }), 
    headers: {
      "Content-Type": "application/json",
      //Authorization: user.token,
    },
  };
  let response = await fetch("/api/quizz/", options);
  console.log("j'ajoute");
  
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
  divContainer.className = "container border border-dark rounded m-2";
  let divRowTitre = document.createElement("div");
  divRowTitre.className = "row m-2";

  // Titre de la question
  let enonceQuestion = document.createElement("input");
  enonceQuestion.type = "text";
  enonceQuestion.placeholder = "Saisissez votre question"
  enonceQuestion.id = "enonceQ" + nbQuestions;
  enonceQuestion.required = true;
  divRowTitre.appendChild(enonceQuestion);

  // Réponses A et B
  let divRowAB = document.createElement("div");
  divRowAB.className = "row justify-content-around";
  let divColA = document.createElement("div");
  divColA.className = "col-6";
  createReponse(divColA, "A");
  let divColB = document.createElement("div");
  divColB.className = "col-6";
  createReponse(divColB, "B");
  divRowAB.appendChild(divColA);
  divRowAB.appendChild(divColB);

  // Réponses C et D
  let divRowCD = document.createElement("div");
  divRowCD.className = "row m-2";
  let divColC = document.createElement("div");
  divColC.className = "col m-2";
  createReponse(divColC,"C");
  let divColD = document.createElement("div");
  divColD.className = "col";
  createReponse(divColD,"D");
  divRowCD.appendChild(divColC);
  divRowCD.appendChild(divColD);

  divContainer.appendChild(divRowTitre);
  divContainer.appendChild(divRowAB);
  divContainer.appendChild(divRowCD);

  if(e != undefined) formAllQuestions.insertBefore(divContainer, containerNewQButton);
  else formAllQuestions.appendChild(divContainer);
};


async function createReponse(divCol, lettre){
  let reponseN = document.createElement("input");
  reponseN.type = "text";
  reponseN.id = "reponse"+lettre+ "" + nbQuestions;
  reponseN.required = true;
  reponseN.placeholder = "Saisissez la réponse "+lettre;

  let bonneReponse = document.createElement("input");
  bonneReponse.type = "radio"
  bonneReponse.value = lettre;
  bonneReponse.name = "radioBonneRep";
  bonneReponse.className = "form-check-input";
  if(lettre === "A") bonneReponse.checked = true;

  divCol.appendChild(bonneReponse);

  divCol.appendChild(reponseN);
  
};

export default CreateQuizz;
