import {setSessionObject, getSessionObject} from "../../utils/session";
import {Redirect} from "../Router/Router";
import Navbar from "../Navbar/Navbar";

let formRegisterLogin = `
<div id="page">
        <div class="container-fluid my-5 text-center text-danger">
            <p class="h1">sQuizz Game</p>
        </div>

      <div class="section">

      <div class="col-12 text-center align-self-center">
        <div class="section pb-5 pt-5 pt-sm-2 text-center">
          <div class="card-3d-wrap mx-auto">
            <div class="card-3d-wrapper cards-single" id="flip-card">



              <div class="card-front ">
                  <div class="section center-wrap text-center">
                    <h4 class="mb-1 pb-3 h2">Connexion</h4>
                    <div class="mb-5">
                      <input type="email" class="form-control form-control-lg "
                             placeholder="Email" id="email-login"/>
                    </div>
                    <div class="mb-4">
                      <input type="password" class="form-control form-control-lg"
                             placeholder="Password" id="password-login"/>
                    </div>
                    <div class="row mb-4">
                      <button class="mt-3 btn btn-outline-light btn-lg px-5 " type="submit" id="btn-login">
                        Se connecter
                      </button>
                    </div>
                    <div class="row">
                      <button class="btn mt-2 btn-outline-light" type="submit" id="go-register">Pas encore inscrit ?
                      </button>
                    </div>
                  </div>
              </div>



              <div class="card-back">
                <div class="center-wrap">
                  <div class="section text-center">
                    <h4 class="mb-1 pb-3 h2">Inscription</h4>
                    <div class="mb-4">
                      <input type="text" class="form-control form-control-lg"
                             placeholder="Name" id="name-register"/>
                    </div>
                    <div class="mb-4">
                      <input type="email" class="form-control form-control-lg"
                             placeholder="Email" id="email-register"/>
                    </div>
                    <div class="mb-4">
                      <input type="password" class="form-control form-control-lg"
                             placeholder="Password" id="password-register"/>
                    </div>
                    <div class="row">
                      <button class="mt-4 btn btn-outline-light btn-lg px-5" type="submit" id="btn-register">
                        S'inscrire
                      </button>
                    </div>
                     <div class="row">
                      <button class="btn mt-3 btn-outline-light" type="submit" id="go-login">
                        Déjà inscrit ?
                      </button>
                    </div>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>
      </div>
</div>


`;

function RegisterAndLoginPage() {
    // let user = getSessionObject("user");
    // if (user) {
    //         Redirect("/");
    // }
    const main = document.querySelector("main");
    main.innerHTML = formRegisterLogin;


    let formLogin = document.getElementById('btn-login');
    let formRegister = document.getElementById('btn-register');

    formLogin.addEventListener('click', onSubmitLogin);
    formRegister.addEventListener('click', onSubmitRegister);

    const flipCard = document.getElementById('flip-card');
    const btnNotAccount = document.getElementById('go-register');
    const btnAccount = document.getElementById('go-login');

    btnNotAccount.addEventListener("click", flipForm);
    btnAccount.addEventListener("click", flipForm);


    function flipForm() {
        flipCard.classList.toggle("flip");
    }

    async function onSubmitRegister(e) {
        e.preventDefault();
        const name = document.getElementById('name-register');
        const email = document.getElementById('email-register');
        const password = document.getElementById('password-register');

        try {
            const options = {
                method: "POST",
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    password: password.value,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch("/api/users/register", options);
            if (!response.ok) {
                throw new Error(
                    "fetch error : " + response.status + " : " + response.statusText
                );
            }
            const user = await response.json();
            console.log("user authenticated", user);
            // save the user into the localStorage
            setSessionObject("user", user);
            Navbar();
            Redirect("/");
        } catch (error) {
            console.error("RegisterAndLoginPage::error: ", error);
        }


    }

    async function onSubmitLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email-login');
        const password = document.getElementById('password-login');
        try {
            const options = {
                method: "POST",
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch("/api/users/login", options);
            if (!response.ok) {
                throw new Error(
                    "fetch error : " + response.status + " : " + response.statusText
                );
            }
            const user = await response.json();
            console.log("user authenticated", user);
            // save the user into the localStorage
            setSessionObject("user", user);
            Navbar();
            Redirect("/");
        } catch (error) {
            console.error("RegisterAndLoginPage::error: ", error);
        }

    }
}

export default RegisterAndLoginPage;