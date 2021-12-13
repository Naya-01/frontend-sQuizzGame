import Logout from "../Logout/Logout";
import CreateQuizz from "../Pages/CreateQuizz";
import HomePage from "../Pages/HomePage";
import RegisterAndLoginPage from "../Pages/RegisterAndLoginPage";
import { ProfilPage } from "../Pages/ProfilPage";
import {PanelAdminPage} from "../Pages/PanelAdminPage"
import {GamePage} from "../Pages/GamePage"
import {QuizzPage} from "../Pages/QuizzPage";
import {AnotherOneProfilPage} from "../Pages/AnotherOneProfilPage";
import {getSessionObject, removeSessionObject} from "../../utils/session";

// Configure your routes here
const routes = {
  "/": HomePage,
  "/logout": Logout,
  "/RegisterAndLoginPage": RegisterAndLoginPage,
  "/CreateQuizz": CreateQuizz,
  "/Profil/MyProfil" : ProfilPage,
  "/PanelAdmin" : PanelAdminPage,
  "/Game" : GamePage,
  "/Quizz" : QuizzPage,
  "/Profil" : AnotherOneProfilPage,
};

const Router = () => {
  /* Manage click on the Navbar */
  let navbarWrapper = document.querySelector("#navbar");
  navbarWrapper.addEventListener("click", (e) => {
    let page = e.target.dataset.page;

    if (page) {
      e.preventDefault();
      if(window.myInterval){
        clearInterval(window.myInterval);
      }
      let current_quizz = getSessionObject("current_quizz");
      if(current_quizz===undefined)removeSessionObject("current_quizz");
      window.history.pushState({}, page, window.location.origin + page);
      const componentToRender = routes[page];
      if (componentToRender) {
        componentToRender();
      } else {
        throw Error("La " + page + " n'existe pas");
      }
    }
  });

  window.addEventListener("load", (e) => {
    const componentToRender = routes[window.location.pathname];
    if (!componentToRender)
      throw Error(
        "La ressource " + window.location.pathname + " n'existe pas."
      );

    componentToRender();
  });

  window.addEventListener("popstate", () => {
    const componentToRender = routes[window.location.pathname];
    componentToRender();
  });
};


const Redirect = (page) => {
  window.history.pushState({}, page, window.location.origin + page);
  const componentToRender = routes[page];
  if (routes[page]) {
    componentToRender();
  } else {
    throw Error("La " + page + " n'existe pas");
  }
};


const RedirectWithParams = (page, params) => {
  window.history.pushState({}, page, window.location.origin + page);
  const componentToRender = routes[page];
  if (routes[page]) {
    componentToRender(params);
  } else {
    throw Error("La " + page + " n'existe pas");
  }
};

const RedirectWithParamsInUrl = (page,action) => {
  window.history.pushState({}, page, window.location.origin + page + action);
  const componentToRender = routes[page];
  if (routes[page]) {
    componentToRender();
  } else {
    throw Error("La " + page + " n'existe pas");
  }
};

export { Router, Redirect, RedirectWithParams, RedirectWithParamsInUrl };
