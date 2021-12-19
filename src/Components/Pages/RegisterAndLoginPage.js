import {setSessionObject, getSessionObject} from "../../utils/session";
import {Redirect} from "../Router/Router";
import Navbar from "../Navbar/Navbar";
import Swal from "sweetalert2";
import UserLibrary from "../../Domain/UserLibrary";
const user = new UserLibrary();

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
    let userSession = getSessionObject("user");
    if (userSession) {
            Redirect("/");
            return;
    }
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

    const enterRegister = document.getElementById("password-register");
    const enterLogin = document.getElementById("password-login");

    enterRegister.addEventListener("keyup", async function (e) {
        e.preventDefault();
        if (e.code === "Enter") await onSubmitRegister(e);
    });
    enterLogin.addEventListener("keyup", async function (e) {
        e.preventDefault();
        if (e.code === "Enter") await onSubmitLogin(e);
    });

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 6000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    function flipForm() {
        flipCard.classList.toggle("flip");
    }

    async function onSubmitRegister(e) {
        e.preventDefault();
        const name = document.getElementById('name-register');
        const email = document.getElementById('email-register');
        const password = document.getElementById('password-register');



        if(name.value.length===0 || email.value.length===0 || password.value.length===0){
            Toast.fire({
                icon: 'error',
                title: 'Veuillez remplir tous les champs'
            });
            return;
        }

        let userFound = await user.userExist(email.value);
        if(userFound){
            Toast.fire({
                icon: 'error',
                title: 'Cette email est déjà utilisé'
            });
            return;
        } else if(!validerEmail(email.value)){
            Toast.fire({
                icon: 'error',
                title: 'Format de l\'email non valide. ' +
                    'Format : example@gmail.com '
            });
            return;
        } else if(name.value.length>20 ||name.value.length<3){
            Toast.fire({
                icon: 'error',
                title: 'La longueur de votre nom doit être compris entre 3 et 20 caractères'
            });
            return;
        } else if(password.value.length>60 || password.value.length<8){
            Toast.fire({
                icon: 'error',
                title: 'La longueur de votre mot de passe doit être compris entre 8 et 60 caractères'
            });
            return;
        }

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

        if(email.value.length===0 || password.value.length===0){
            Toast.fire({
                icon: 'error',
                title: 'Veuillez remplir tous les champs'
            });
            return;
        }

        let userFound = await user.userExist(email.value);

        if(!userFound){
            Toast.fire({
                icon: 'error',
                title: 'Cet utilisateur n\'existe pas'
            });
            return;
        }

        let match = await user.passwordMatch(email.value,password.value);
        if(!match){
            Toast.fire({
                icon: 'error',
                title: 'Mot de passe incorrect'
            });
            return;
        }

        let isBan = await user.isBanned(email.value);
        if(isBan){
            Toast.fire({
                icon: 'error',
                title: 'Utilisateur banni '
            });
            return;
        }


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
            // save the user into the localStorage
            setSessionObject("user", user);
            Navbar();
            Redirect("/");
        } catch (error) {
            console.error("RegisterAndLoginPage::error: ", error);
        }

    }

    function validerEmail(_email){
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return !!_email.match(regex);

    }
}

export default RegisterAndLoginPage;