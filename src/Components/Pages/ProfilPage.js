import ProfilLibrary from "../../Domain/ProfilLibrary";
import { getSessionObject } from "../../utils/session";
import { Redirect } from "../Router/Router";

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
      let elementId = e.target.dataset.elementId;
      await profilLibrary.deleteQuizzFromProfil(elementId);
      ProfilPage();
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
