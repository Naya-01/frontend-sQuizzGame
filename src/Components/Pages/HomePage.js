
const HomePage = async () => {
  /*
  let user = getSessionObject("user");
  if (!user) {
        Redirect("/RegisterAndLoginPage");
  }*/
  const main = document.querySelector("main");
  main.innerHTML = ""; // on reinitialise le main
  let allQuizz = await fetch("/api/quizz/");
  allQuizz = await allQuizz.json();

  let container = document.createElement("div");
  container.className = "container";

  // Sous-Titre Tendances
  let tendances = document.createElement("div")
  tendances.className = "row m-4";
  let tendances_title = document.createElement("h4");
  tendances_title.innerHTML = "Tendances";
  tendances.appendChild(tendances_title);
  container.appendChild(tendances);

  // TODO : insérer les cards Quizz tendances ici

  // Sous-Titre Explorer
  let explorer = document.createElement("div")
  explorer.className = "row m-4";
  let explorer_title = document.createElement("h4");
  explorer_title.innerHTML = "Explorer";
  explorer.appendChild(explorer_title);
  container.appendChild(explorer);


  // Créer une row
  for(let j = 0; j < allQuizz.length/3; j++){
      let row = document.createElement("div");
      row.className = "row m-4"
    for(let i=0; i <  3; i++){ 
        let indice = i+(j*3);
        if(allQuizz[indice] == undefined) break;
        let col = document.createElement("div");
        col.className = "col";

        // Création de la card quizz
        let divCard = document.createElement("div");
        divCard.className = 'card';
        divCard.style = "width: 18rem";
        let div = document.createElement("div");
        div.className = 'card-body';
        
        // Nom du quizz
        let title = document.createElement("h5");
        title.className = 'card-title';
        title.innerHTML = allQuizz[indice].name;

        let likes_p = document.createElement("p");
        let likes = await fetch("/api/quizz/likes/"+allQuizz[indice].id_quizz);
        likes = await likes.json();
        console.log(Object.values(likes));
        likes_p.innerHTML = likes[0].nblikes + " likes";

        
        // Créateur du quizz
        let creator = await fetch("/api/users/"+allQuizz[indice].id_creator);
        creator = await creator.json();
        let subtitle = document.createElement("h6");
        subtitle.className = "card-subtitle mb-2 text-muted";
        subtitle.innerHTML = "par "+creator.name;
            
        // Description du quizz
        let description = document.createElement("p");
        description.className = "card-text";
        description.innerHTML = allQuizz[indice].description; // TODO : limiter la description à x caractères
        
        // Bouton pour jouer au quizz
        let divButton = document.createElement("div");
        divButton.className = "d-grid gap-2";
        let buttonPlay = document.createElement("button");
        buttonPlay.className = "btn btn-primary";
        buttonPlay.type = "button";
        buttonPlay.innerHTML = "Jouer";
        divButton.appendChild(buttonPlay);
        
        div.appendChild(title);
        div.appendChild(likes_p);
        div.appendChild(subtitle);
        div.appendChild(description);
        div.appendChild(divButton);
        
        divCard.appendChild(div);
        col.appendChild(divCard);
        row.appendChild(col);
    } 
    container.appendChild(row); 
  }
  main.appendChild(container); // On affiche déjà une première fois en attendant
 
  
};

export default HomePage;