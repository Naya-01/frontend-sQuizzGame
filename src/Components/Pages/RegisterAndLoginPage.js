import { setSessionObject,getSessionObject } from "../../utils/session";
import { Redirect } from "../Router/Router";
import Navbar from "../Navbar/Navbar";
let formRegisterLogin = `
<div id="page">
        <div class="container-fluid my-5 text-center text-danger">
            <p class="h1">sQuizz Game</p>
        </div>

        <div class="container my-5">
            <div class="row">


                
                <div class="col mt-1">
                    <div class="container">
                        <div class="row justify-content-center align-items-center h-100">
                            <div class="col-sm-9">
                                <div class="card bg-dark text-white" style="border-radius: 1rem;">
                                    <div class="card-body p-5 text-center">
                                        <form id="inscription">
                                            <h2 class="fw-bold mb-2 text-uppercase">Inscription</h2>
                                            <div class="form-outline form-white mb-4">
                                                <input type="text" class="form-control form-control-lg" id="name-register"
                                                       placeholder="Name"/>
                                            </div>
                                            <div class="form-outline form-white mb-4">
                                                <input type="email" class="form-control form-control-lg" id="email-register"
                                                       placeholder="Email"/>
                                            </div>
                                            <div class="form-outline form-white mb-4">
                                                <input type="password" class="form-control form-control-lg" id="password-register"
                                                       placeholder="Password"/>
                                            </div>
                                            <button class="btn btn-outline-light btn-lg px-5" type="submit">S'inscrire</button>
                                         </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="col mt-1">
                    <div class="container">
                        <div class="row justify-content-center align-items-center h-100">
                            <div class="col-sm-9">
                                <div class="card bg-dark text-white" style="border-radius: 1rem;">
                                    <div class="card-body p-5 text-center">
                                        <form id="connexion">
                                            <h2 class="fw-bold mb-4 text-uppercase">Connexion</h2>
                                            <div class="form-outline form-white mb-5">
                                                <input type="email"  class="form-control form-control-lg" id="email-login"
                                                       placeholder="Email"/>
                                            </div>
                                            <div class="form-outline form-white mb-2">
                                                <input type="password"  class="form-control form-control-lg" id="password-login"
                                                       placeholder="Password"/>
                                            </div>
                                            <button class="mt-5 btn btn-outline-light btn-lg px-5" type="submit">Se connecter</button>
                                        </form>
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


    let formLogin = document.getElementById('connexion');
    let formRegister = document.getElementById('inscription');

    formLogin.addEventListener('submit',onSubmitLogin);
    formRegister.addEventListener('submit',onSubmitRegister);

    async function onSubmitRegister(e) {
        e.preventDefault();
        const name = document.getElementById('name-register');
        const email = document.getElementById('email-register');
        const password = document.getElementById('password-register');

        try{
            const options = {
                method: "POST",
                body: JSON.stringify({
                    name:name.value,
                    email:email.value,
                    password:password.value,
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
        }catch(error){
            console.error("RegisterAndLoginPage::error: ", error);
        }

      
    }

    async function onSubmitLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email-login');
        const password = document.getElementById('password-login');
        try{
            const options = {
                method: "POST",
                body: JSON.stringify({
                    email:email.value,
                    password:password.value,
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
        }catch(error){
            console.error("RegisterAndLoginPage::error: ", error);
        }
      
    }
  }
  
  export default RegisterAndLoginPage;