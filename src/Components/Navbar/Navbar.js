import { getSessionObject } from "../../utils/session";
import { Redirect } from "../Router/Router";
import logo_squizz_game from "../../img/SquizzGameTransparent.png";
import logo_vinci from "../../img/vinci.png";
import UserLibrary from "../../Domain/UserLibrary";
const userLibrary = new UserLibrary();

const Navbar = async () => {
    const navbarWrapper = document.querySelector("#navbar");
    let navbar;

    // Get the user object from the localStorage
    let userSession = getSessionObject("user");
    if (!userSession) {
        navbarWrapper.innerHTML = "";
        Redirect("/RegisterAndLoginPage");
    }
    else{
        let user = await userLibrary.getUserOfSession();

        navbar = `<nav class="navbar navbar-expand-sm navbar-dark bg-secondary">
        <img src="${logo_squizz_game}" alt="logo squizz game" id="logoSG" data-page="/">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar6">
            <span class="navbar-toggler-icon"></span>
        </button>
    
        <div class="navbar-collapse collapse" id="navbar6">
            <ul class="navbar-nav">
                <li class="nav-item">
                        <a class="nav-link active" href="#" data-page="/CreateQuizz">Créer un quizz</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="#" data-page="/Profil/MyProfil">Mon profil</a>
                    </li>
                    `;

                if (user.is_admin) {
                    navbar += `
                    <li class="nav-item">
                        <a class="nav-link active" href="#" data-page="/PanelAdmin">Gestion administrative</a>
                    </li>`;
                }
                navbar += `
                <li class="nav-item">
                    <a class="nav-link active" href="#" data-page="/logout">Se deconnecter</a>
                </li>
            </ul>
          </div>
          <a href="https://www.vinci.be/fr/">
            <img class="text-end" src="${logo_vinci}" alt="logo vinci" id="logoSG">
          </a>
        </nav>`;
        navbarWrapper.innerHTML = navbar;

    }

};

export default Navbar;