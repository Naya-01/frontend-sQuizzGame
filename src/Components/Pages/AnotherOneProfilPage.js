import ProfilLibrary from "../../Domain/ProfilLibrary";
import UserLibrary from "../../Domain/UserLibrary";
import { getSessionObject } from "../../utils/session";
import { Redirect, RedirectWithParams} from "../Router/Router";

const profilLibrary = new ProfilLibrary();
const userLibrary = new UserLibrary();

const AnotherOneProfilPage = async () => {
  const main = document.querySelector("main");
  let userSession = getSessionObject("user");
  if (!userSession) {
    Redirect("/RegisterAndLoginPage");
  }

  let url_string = window.location;
  let url = new URL(url_string);
  let idUserUrl = url.searchParams.get("idUser");
  if (!idUserUrl)
    main.innerHTML = `
      <div class="in-middle">
        <h1 >Profil introuvable</h1>
      </div>`;
  else if (isNaN(idUserUrl) || idUserUrl < 0) {
    main.innerHTML = `
      <div class="in-middle">
        <h1 >Profil introuvable</h1>
      </div>`;
  }
  else if (userSession.id_user == idUserUrl) {
    Redirect("/Profil/MyProfil");
  }  else {
    const page = await profilLibrary.getAnotherOneProfilPage(
      userSession,
      idUserUrl
    );
    main.innerHTML = page;
    const subscribeButton = document.getElementById("subscribe");
    const unsubscribeButton = document.getElementById("unsubscribe");

    if (subscribeButton == null) {
      unsubscribeButton.addEventListener("click", async (e) => {
        let elementIdUser = e.target.dataset.elementIdUser;
        let elementIdFollower = e.target.dataset.elementIdFollower;
        await userLibrary.unsubscribe(elementIdUser, elementIdFollower);
        AnotherOneProfilPage();
      });
    } else {
      subscribeButton.addEventListener("click", async (e) => {
        let elementIdUser = e.target.dataset.elementIdUser;
        let elementIdFollower = e.target.dataset.elementIdFollower;
        let users = {
          id_user: elementIdUser,
          id_follower: elementIdFollower,
        };
        await userLibrary.subscribe(users);
        AnotherOneProfilPage();
      });
    }
    
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
          AnotherOneProfilPage();
        });
        //refresh the page (press no)
        buttonNo.addEventListener("click", (e) => {
          AnotherOneProfilPage();
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

    document.getElementById("abonnes").addEventListener("click", profilLibrary.clickOnAbonnesOrAbonnements);
    document.getElementById("abonnements").addEventListener("click", profilLibrary.clickOnAbonnesOrAbonnements);
    
  }
};

export { AnotherOneProfilPage };
