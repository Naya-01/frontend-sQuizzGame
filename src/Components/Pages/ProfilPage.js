import ProfilLibrary from "../../Domain/ProfilLibrary";
import { RedirectWithParams } from "../Router/Router";
import Swal from 'sweetalert2';

const profilLibrary = new ProfilLibrary();

/**
 * makes the my profil page
 */
const ProfilPage = async () => {
  const main = document.querySelector("main");

  //display my profil page
  const page = await profilLibrary.getMyProfilPage();
  main.innerHTML = page;

  
  //if click the subscribers button
  document.getElementById("abonnes").addEventListener("click", profilLibrary.clickOnSubscribersOrSubscriptions);
  //if click the subscriptions button
  document.getElementById("abonnements").addEventListener("click", profilLibrary.clickOnSubscribersOrSubscriptions);
  
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

      //listener to delete a quizz (click yes)
      buttonYes.addEventListener("click", async (e) => {
        await profilLibrary.deleteQuizzFromProfil(elementId);
        await ProfilPage();
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
        ProfilPage();
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

  
};

export { ProfilPage };
