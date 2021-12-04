import { setSessionObject,getSessionObject } from "../../utils/session";

function RegisterAndLoginPage() {
    let user = getSessionObject("user");
    if (user) {
            Redirect("/");
    }
    const main = document.querySelector("main");
    main.innerHTML = "Vous etes dans la login page";
    
    function onSubmitRegister(e) {
        e.preventDefault();
      
        Redirect("/");
      
    }

    function onSubmitLogin(e) {
        e.preventDefault();
      
        Redirect("/");
      
    }
  }
  
  export default RegisterAndLoginPage;