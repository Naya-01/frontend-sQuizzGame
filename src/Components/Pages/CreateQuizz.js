import closeIcon from "../../img/croix.png";

let nbQuestions;
let main ;
let formAllQuestions;
let containerNewQButton; 


const CreateQuizz = async () => {
  /*
  let user = getSessionObject("user");
  if (!user) {
        Redirect("/RegisterAndLoginPage");
  }*/
  nbQuestions = 0;
  // Titre de la page
  main = document.querySelector("main");
  main.innerHTML = " ";
  formAllQuestions = document.createElement("form");
  containerNewQButton =  document.createElement("div");
  let createQuizzTitle = document.createElement("h1");
  createQuizzTitle.innerHTML = "Créer un quizz";
  let containerTitle = document.createElement("div");
  containerTitle.className = "container-fluid my-5 text-center text-danger";
  containerTitle.appendChild(createQuizzTitle);
  main.appendChild(containerTitle);

  // Ajout du titre du quizz
  let containerTitleQuizz = document.createElement("div");
  containerTitleQuizz.className = "container rounded-lg m-5 p-2";
  let divTitleQuizz = document.createElement("div");
  divTitleQuizz.className = "row ";
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
  containerDescQuizz.className = "container rounded-lg m-5 p-2";
  let divDescQuizz = document.createElement("div");
  divDescQuizz.className = "row ";
  let descQuizz = document.createElement("input"); //TODO : description entre 35
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

  
  
  // Formulaire pour ajouter une question au quizz
  const newQuestionButton = document.createElement("input");
  containerNewQButton.className = "container-fluid my-3 text-center";
  newQuestionButton.value = "+ Nouvelle Question +";
  newQuestionButton.type = "button";
  newQuestionButton.className = "btn btn-primary";
  newQuestionButton.addEventListener("click", nouvelleQuestion);
  containerNewQButton.appendChild(newQuestionButton);
  formAllQuestions.appendChild(containerNewQButton);

  // Bouton pour creer un quizz
  let containerCreateButton = document.createElement("div");
  containerCreateButton.className = "container-fluid text-center";
  const createQuizzButton = document.createElement("input");
  createQuizzButton.value = "Créer le quizz";
  createQuizzButton.type = "submit";
  createQuizzButton.className = "btn btn-primary";
  containerCreateButton.appendChild(createQuizzButton);
  formAllQuestions.appendChild(containerCreateButton);
  formAllQuestions.addEventListener("submit", soumettreQuizz);
  
  
  main.appendChild(formAllQuestions);
  
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
  main.innerHTML = "Le quizz a été ajouté avec succès";
  
}

/**
 * Création d'une nouvelle question
 * @param {*} e evenement
 */
async function nouvelleQuestion(e) {
  //TODO : limiter questions à 15
  if (e != undefined) e.preventDefault();
  nbQuestions++;

  //Création du container
  let divContainer = document.createElement("div");
  divContainer.className = "container border bg-dark border-success rounded-lg m-5 p-2";
  // divContainer.style = "background-color: #3cb371";
  divContainer.id = "containerQ"+nbQuestions;
  let divRowTitre = document.createElement("div");
  divRowTitre.className = "row m-2";

  // Titre de la question
  let enonceQuestion = document.createElement("input");
  enonceQuestion.type = "text";
  enonceQuestion.placeholder = "Saisissez votre question"
  enonceQuestion.id = "enonceQ" + nbQuestions;
  enonceQuestion.required = true;
  enonceQuestion.style.width = "100%";
  let num = document.createElement("label");
  num.innerHTML = nbQuestions;
  num.id = "numQ"+nbQuestions;
  num.for = "enonceQ" + nbQuestions;
  num.style.fontSize = "large";
  num.style = "color : white";

  let closeImage = document.createElement("img");
  closeImage.src = closeIcon;
  closeImage.alt = "bouton pour supprimer une question"
  closeImage.style.width = "30px";
  closeImage.id = "closeQ"+nbQuestions;
  closeImage.addEventListener("click", supprimerQuestion);


  let divColTitre1 = document.createElement("div");
  divColTitre1.className = "col-1";
  divColTitre1.appendChild(num);
  let divColTitre2 = document.createElement("div");
  divColTitre2.className = "col-10";
  divColTitre2.appendChild(enonceQuestion);
  let divColTitre3 = document.createElement("div");
  divColTitre3.className = "col-1";
  divColTitre3.appendChild(closeImage);

  divRowTitre.appendChild(divColTitre1);
  divRowTitre.appendChild(divColTitre2);
  divRowTitre.appendChild(divColTitre3);

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
  divRowCD.className = "row justify-content-around";
  let divColC = document.createElement("div");
  divColC.className = "col-6";
  createReponse(divColC,"C");
  let divColD = document.createElement("div");
  divColD.className = "col-6";
  createReponse(divColD,"D");
  divRowCD.appendChild(divColC);
  divRowCD.appendChild(divColD);

  divContainer.appendChild(divRowTitre);
  divContainer.appendChild(divRowAB);
  
  // A modifier
  let br = document.createElement("br")
  divContainer.appendChild(br);
  //
  
  divContainer.appendChild(divRowCD);

  if(e != undefined) formAllQuestions.insertBefore(divContainer, containerNewQButton);
  else formAllQuestions.appendChild(divContainer);
};

async function supprimerQuestion(e){
  e.preventDefault();
  if(nbQuestions === 1) return;

  //On récupère celui qu'on doit supprimer
  let numQuestion = e.target.id.substring(6, 7);
  console.log("on supprime"+numQuestion);
  let nomContainerQuestion =  "containerQ"+numQuestion;

  //On le supprime
  formAllQuestions.removeChild(document.getElementById(nomContainerQuestion));
  
  numQuestion = parseInt(numQuestion, 10);

  //Cas où on supprime la dernière question
  if(numQuestion === nbQuestions) {
    nbQuestions --;
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

}

async function createReponse(divCol, lettre){
  let reponseN = document.createElement("input");
  reponseN.type = "text";
  reponseN.id = "reponse"+lettre+ "" + nbQuestions;
  reponseN.required = true;
  reponseN.placeholder = "Saisissez la réponse "+lettre;
  reponseN.style.width = "80%";

  let bonneReponse = document.createElement("input");
  bonneReponse.type = "radio"
  bonneReponse.value = lettre;
  bonneReponse.name = "radioBonneRep"+nbQuestions;
  bonneReponse.id = "radioBonneRep"+nbQuestions+""+lettre;
  bonneReponse.className = "form-check-input";
  if(lettre === "A") bonneReponse.checked = true;

  divCol.appendChild(bonneReponse);
  divCol.appendChild(reponseN);
  
};

export default CreateQuizz;
