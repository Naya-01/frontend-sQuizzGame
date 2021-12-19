import ProfilLibrary from "../../Domain/ProfilLibrary";
import UserLibrary from "../../Domain/UserLibrary";
import { Redirect, RedirectWithParams} from "../Router/Router";
import Swal from 'sweetalert2';

const profilLibrary = new ProfilLibrary();
const userLibrary = new UserLibrary();

/**
 * makes the another one profil page
 */
const AnotherOneProfilPage = async () => {
  const main = document.querySelector("main");

  let url_string = window.location;
  let url = new URL(url_string);
  let idUserUrl = url.searchParams.get("idUser");

  //get objet of user session
  let objetUserSession = await userLibrary.getUserOfSession();
  //if not id user in url, display profil not found
  if (!idUserUrl)
    main.innerHTML = `
      <div class="in-middle">
        <h1 >Profil introuvable</h1>
      </div>`;
  //if bad id user in url, display profil not found 
  else if (isNaN(idUserUrl) || idUserUrl < 0) {
    main.innerHTML = `
      <div class="in-middle">
        <h1 >Profil introuvable</h1>
      </div>`;
  }
  //if id user in url is equal to the one of the session
  else if (objetUserSession.id_user == idUserUrl) {
    Redirect("/Profil/MyProfil");
  } 
  else {
    
    //display another one profil
    const page = await profilLibrary.getAnotherOneProfilPage(
      objetUserSession,
      idUserUrl
    );
    main.innerHTML = page;
    const subscribeButton = document.getElementById("subscribe");
    const unsubscribeButton = document.getElementById("unsubscribe");
    
    //if subscribe button is not displayed, listen the unsubscribe button
    if (subscribeButton == null) {
      //if click on unsubscribe button, decrement number of subscription to user session
      //and decrement number of subscribers to user in url
      unsubscribeButton.addEventListener("click", async (e) => {
        let elementIdUser = e.target.dataset.elementIdUser;
        let elementIdFollower = e.target.dataset.elementIdFollower;
        await userLibrary.unsubscribe(elementIdUser, elementIdFollower);
        AnotherOneProfilPage();
      });
    }
    //else, listen the subscribe button 
    else {
      //if click on subscribe button, increment number of subscription to user session
      //and increment number of subscribers to user in url
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

    //if click on the title of a quizz
    main.querySelectorAll(".titlesQuizzBox").forEach((titleDisplayed) => {
      titleDisplayed.addEventListener("click", (e) => {
      
        let elementId = e.target.dataset.elementId;
        let elementNameQuizz = e.target.dataset.elementNameQuizz;
        let elementLongNameQuizz = e.target.dataset.elementLongNameQuizz;
        let hiddenState = document.getElementById("quizz" + elementId);
        //if the title is too long, make it clickable
        if(elementLongNameQuizz.length>20){
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
        }
      });
    });

    //if click the delete button of a quizz, ask first if the person is sure
    main.querySelectorAll(".delete").forEach((button) => {
      button.addEventListener("click", async (e) => {
  
        //getters
        let elementId = e.target.dataset.elementId;
        let requestIfDelete = document.getElementById("delete" + elementId);
  
        //get all the buttons
        let parent = button.parentElement;
        let childrenParentButton = parent.children;
        let tabChidrenButtons = [];
        for (let i = 0; i < childrenParentButton.length; i++) {
          let classElement = childrenParentButton[i].tagName;
          if (classElement === "BUTTON")
            tabChidrenButtons.push(childrenParentButton[i]);
        }
        //removing buttons and display question
        requestIfDelete.innerHTML = `Etes vous sûr de vouloir supprimer?`;
        parent.removeChild(tabChidrenButtons[0]);
        parent.removeChild(tabChidrenButtons[1]);
        //create button yes
        let buttonYes = document.createElement("button");
        buttonYes.innerHTML = "Oui";
        buttonYes.className = "btn btn-success";
        buttonYes.setAttribute("data-id", elementId);
        buttonYes.type = "button";
        parent.appendChild(buttonYes);
        //create button no
        let buttonNo = document.createElement("button");
        buttonNo.innerHTML = "Non";
        buttonNo.className = "btn btn-danger";
        buttonNo.setAttribute("data-id", elementId);
        buttonNo.type = "button";
        parent.appendChild(buttonNo);
  
        //listener to unban someone (click yes)
        buttonYes.addEventListener("click", async (e) => {
          await profilLibrary.deleteQuizzFromProfil(elementId);
          await AnotherOneProfilPage();
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'success',
            title: 'Le quizz a été supprimé avec succès.'
          })
        });
        //refresh the page (click no)
        buttonNo.addEventListener("click", (e) => {
          AnotherOneProfilPage();
        });
      });
    });

    //if click the play button of a quizz, redirect to the page of that quizz game
    main.querySelectorAll(".play").forEach((button) => {
      button.addEventListener("click", async (e) => {
        let elementId = e.target.dataset.elementId;
        e.preventDefault();
        RedirectWithParams("/Quizz",elementId);
      });
    });

    document.getElementById("abonnes").addEventListener("click", profilLibrary.clickOnSubscribersOrSubscriptions);
    document.getElementById("abonnements").addEventListener("click", profilLibrary.clickOnSubscribersOrSubscriptions);
    
  }
};

export { AnotherOneProfilPage };
