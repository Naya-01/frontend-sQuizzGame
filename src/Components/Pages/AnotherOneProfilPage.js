import ProfilLibrary from "../../Domain/ProfilLibrary";
import UserLibrary from "../../Domain/UserLibrary";
import { getSessionObject } from "../../utils/session";
import { Redirect } from "../Router/Router";

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
  if (userSession.id_user == idUserUrl) {
    Redirect("/Profil/MyProfil");
  } else {
    const page = await profilLibrary.getAnotherOneProfilPage(userSession,idUserUrl);
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
  }
};

export { AnotherOneProfilPage };
