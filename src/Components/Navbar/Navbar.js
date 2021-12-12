import { getSessionObject } from "../../utils/session";
import { Redirect } from "../Router/Router";
import UserLibrary from "../../Domain/UserLibrary";
const userLibrary = new UserLibrary();

const Navbar = async () => {
    const navbarWrapper = document.querySelector("#navbar");
    let navbar;

    // Get the user object from the localStorage
    let userSession = getSessionObject("user");
    if (!userSession) { //TODO : mettre !user quand ça sera implémenté
        navbarWrapper.innerHTML = "";
        Redirect("/RegisterAndLoginPage");
    }
    else{
        let user = await userLibrary.getUser(userSession.id_user);

        navbar = `<nav class="navbar navbar-expand-lg navbar-light bg-success">
        <div class="container-fluid">
        <a class="navbar-brand" href="#" data-page="/">sQuizz Game</a>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#" data-page="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#" data-page="/CreateQuizz">Créer un quizz</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#" data-page="/Profil/MyProfil">Mon profil</a>
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
        </div>
        </nav>`;
        navbarWrapper.innerHTML = navbar;

    }

};

export default Navbar;