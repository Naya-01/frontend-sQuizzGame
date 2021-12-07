let main;
//TODO : avoir plusieurs pages au lieu d'un scroll infini
const HomePage = async () => {
  /*
  let user = getSessionObject("user");
  if (!user) {
        Redirect("/RegisterAndLoginPage");
  }*/
  main = document.querySelector("main");
  main.innerHTML = " "; // on reinitialise le main
  
  // Titre de la page
  let containerSquizzGame = document.createElement("div");
  containerSquizzGame.className = "container-fluid my-5 text-center text-danger";
  let titleSquizzGame = document.createElement("h1");
  titleSquizzGame.innerHTML = "sQuizzGame";
  containerSquizzGame.appendChild(titleSquizzGame);
  main.appendChild(containerSquizzGame);


  let container = document.createElement("div");
  container.className = "container";

  // Sous-Titre Tendances
  let tendances = document.createElement("div")
  tendances.className = "container";
  let tendances_title = document.createElement("h4");
  tendances_title.innerHTML = "Tendances";
  tendances.appendChild(tendances_title);
  main.appendChild(tendances);

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
  // Sous-Titre Explorer
  let explorer = document.createElement("div")
  explorer.className = "container";
  let explorer_title = document.createElement("h4");
  explorer_title.innerHTML = "Explorer";
  explorer.appendChild(explorer_title);
  main.appendChild(explorer);

  let allQuizz = await fetch("/api/quizz/");
  allQuizz = await allQuizz.json();
  console.log(allQuizz);
  afficherQuizz(allQuizz);
 
};

async function afficherQuizz(allQuizz){
   // Créer une row
   for(let j = 0; j < allQuizz.length/3; j++){
    let container3Q = document.createElement("div");
    container3Q.className = "container my-5"
    main.appendChild(container3Q);
    let row3Q = document.createElement("div");
    row3Q.className = "row";
    container3Q.appendChild(row3Q);
  for(let i=0; i <  3; i++){ 
      let indice = i+(j*3);
      let col = document.createElement("div");
      col.className = "col";
      row3Q.appendChild(col);
      if(allQuizz[indice] == undefined) break;
      

      // Création de la card quizz
      let divCard = document.createElement("div");
      divCard.className = 'card';
      divCard.style = "width: 18rem;";
      let div = document.createElement("div");
      div.className = 'card-body';
      divCard.appendChild(div);
      col.appendChild(divCard);
      
      
      // Nom du quizz
      let title = document.createElement("h5");
      title.className = 'card-title';
      title.innerHTML = allQuizz[indice].name;
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
      description.style = " height: 4rem";
      let descriptionTexte = allQuizz[indice].description;
      if(descriptionTexte.length > 40){
        descriptionTexte = descriptionTexte.substring(0, 40);
        descriptionTexte += " ...";
      }
      description.innerHTML = descriptionTexte; // TODO : limiter la description à x caractères
      div.appendChild(description);
      
      // Bouton pour jouer au quizz
      let divButton = document.createElement("div");
      divButton.className = "d-grid gap-2";
      let buttonPlay = document.createElement("button");
      buttonPlay.className = "btn btn-primary";
      buttonPlay.type = "button";
      buttonPlay.innerHTML = "Jouer";
      buttonPlay.style = "width:100%";
      div.appendChild(buttonPlay);



      
  } 
  //main.appendChild(container);
}  
}
export default HomePage;