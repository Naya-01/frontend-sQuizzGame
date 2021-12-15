import ProfilLibrary from "../../Domain/ProfilLibrary";
import { getSessionObject } from "../../utils/session";
import { Redirect,RedirectWithParams } from "../Router/Router";

const profilLibrary = new ProfilLibrary();

const ProfilPage = async () => {
  const main = document.querySelector("main");
  let userSession = getSessionObject("user");
  if (!userSession) {
    Redirect("/RegisterAndLoginPage");
  }

  const page = await profilLibrary.getMyProfilPage(userSession);
  main.innerHTML = page;

  main.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", async (e) => {

      //getters
      let elementId = e.target.dataset.elementId;
      let requestIfDelete = document.getElementById("delete" + elementId);

      //get all the buttons
      let parent = button.parentElement;
      let childrenParentButton = parent.children;
      let tabChidrenButtons = [];
      for (let i = 0; i < childrenParentButton.length; i++) {
        let classElement = childrenParentButton[i].tagName;
        if (classElement === "BUTTON")
          tabChidrenButtons.push(childrenParentButton[i]);
      }
      //removing buttons and display question
      requestIfDelete.innerHTML = `Etes vous sûr de vouloir supprimer?`;
      parent.removeChild(tabChidrenButtons[0]);
      parent.removeChild(tabChidrenButtons[1]);
      //create button yes
      let buttonYes = document.createElement("button");
      buttonYes.innerHTML = "Oui";
      buttonYes.className = "btn btn-success";
      buttonYes.setAttribute("data-id", elementId);
      buttonYes.type = "button";
      parent.appendChild(buttonYes);
      //create button no
      let buttonNo = document.createElement("button");
      buttonNo.innerHTML = "Non";
      buttonNo.className = "btn btn-danger";
      buttonNo.setAttribute("data-id", elementId);
      buttonNo.type = "button";
      parent.appendChild(buttonNo);

      //listener to unban someone (press yes)
      buttonYes.addEventListener("click", async (e) => {
        await profilLibrary.deleteQuizzFromProfil(elementId);
        ProfilPage();
      });
      //refresh the page (press no)
      buttonNo.addEventListener("click", (e) => {
        ProfilPage();
      });


      
    });
  });

  main.querySelectorAll(".play").forEach((button) => {
    button.addEventListener("click", async (e) => {
      let elementId = e.target.dataset.elementId;
      e.preventDefault();
      RedirectWithParams("/Quizz",elementId);
    });
  });


  main.querySelectorAll(".titlesQuizzBox").forEach((titleDisplayed) => {
    titleDisplayed.addEventListener("click", (e) => {
    
      let elementId = e.target.dataset.elementId;
      let elementNameQuizz = e.target.dataset.elementNameQuizz;
      let elementLongNameQuizz = e.target.dataset.elementLongNameQuizz;
      let hiddenState = document.getElementById("quizz" + elementId);
      //display whole title
      if (hiddenState.innerHTML == 0) {
        let height = parseInt(elementLongNameQuizz.length / 20 + 1);
        titleDisplayed.style = `height:${height}rm`;
        titleDisplayed.innerHTML = elementLongNameQuizz;
        hiddenState.innerHTML = 1;
      }
      //display a part of title
      else {
        titleDisplayed.style = "height:2rem";
        titleDisplayed.innerHTML = elementNameQuizz;
        hiddenState.innerHTML = 0;
      }
    });
  });

  
};

export { ProfilPage };
