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


  
};

export { ProfilPage };
