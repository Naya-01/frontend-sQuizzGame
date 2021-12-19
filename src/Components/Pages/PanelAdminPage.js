import UserLibrary from "../../Domain/UserLibrary";
import { Redirect,RedirectWithParamsInUrl } from "../Router/Router";
import Swal from 'sweetalert2';
const userLibrary = new UserLibrary();
const main = document.querySelector("main");

/**
 * makes the panel admin page
 */
const PanelAdminPage = async () => {
  let filter;
  let url_string = window.location;
  let url = new URL(url_string);
  let filterUrl = url.searchParams.get("filter");

  if (!filterUrl) filter="";
  else filter=filterUrl;

  //if user session is not admin, redirect to home page
  let user = await userLibrary.getUserOfSession();
  if (!user.is_admin) Redirect("/");
  
  else {
    //display panel admin
    let page = await userLibrary.getPanelAdminPage(filter,user);
    main.innerHTML = page;

    await addEventListeners();
  }
};

/**
 * function having the main add event listener
 * @param {String} filter 
 */
const addEventListeners = async () =>{
  //if user press Enter in search bar, display users having the filter in their name or email
  const listenerPressEnterSearchBar = async (e) =>{
    if(e.key==="Enter"){
      let inputSearchBox = document.querySelector("#searchBar");
      RedirectWithParamsInUrl("/PanelAdmin","?filter="+inputSearchBox.value);
    } 
  }
  //if click the ban button of a user, ask first if the person is sure
  main.querySelectorAll(".ban").forEach(async (button) => {
    button.addEventListener("click", async (e) => {
      //getters
      let elementId = e.target.dataset.elementId;
      let requestIfUpgradeOrBan = document.getElementById("user" + elementId);

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
      requestIfUpgradeOrBan.innerHTML = `Etes vous sûr de vouloir bannir ?`;
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

      //listener to ban someone (click yes), ban the user
      buttonYes.addEventListener("click", async (e) => {
        const userToBan = {
          id_user: parseInt(elementId),
        };
        await userLibrary.banUser(userToBan);

        await PanelAdminPage();
        sweetAlert("L'utilisateur a été banni avec succès.");
      });
      //refresh the page (click no)
      buttonNo.addEventListener("click", (e) => {
        PanelAdminPage();
      });
    });
  });
  //if click on the username of a user, redirect to his profil
  main.querySelectorAll(".linkUsername").forEach(async (button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      let elementId = e.target.dataset.elementId;
      RedirectWithParamsInUrl("/Profil","?idUser="+elementId);
    });
  });
  //if click the upgrade button of a user, ask first if the person is sure
  main.querySelectorAll(".upgrade").forEach(async (button) => {
    button.addEventListener("click", async (e) => {
      let elementId = e.target.dataset.elementId;

      let requestIfUpgradeOrBan = document.getElementById("user" + elementId);

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
      requestIfUpgradeOrBan.innerHTML = `Etes vous sûr de vouloir promouvoir ?`;
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

      //listener to upgrade someone (click yes), upgrade the user
      buttonYes.addEventListener("click", async (e) => {
        const userToUpgrade = {
          id_user: parseInt(elementId),
        };
        await userLibrary.upgradeUser(userToUpgrade);
        await PanelAdminPage();
        sweetAlert("L'utilisateur a été promu avec succès.");
      });
      //refresh the page (click no)
      buttonNo.addEventListener("click", (e) => {
        PanelAdminPage();
      });
    });
  });
  //if click the unban button of a user, ask first if the person is sure
  main.querySelectorAll(".unban").forEach(async (button) => {
    button.addEventListener("click", async (e) => {
      //getters
      let elementId = e.target.dataset.elementId;
      let requestIfBan = document.getElementById("ban" + elementId);
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
      requestIfBan.innerHTML = `Etes vous sûr de vouloir débannir ?`;
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

      //listener to unban someone (click yes), unban the user
      buttonYes.addEventListener("click", async (e) => {
        const userToUnban = {
          id_user: parseInt(elementId),
        };
        await userLibrary.unbanUser(userToUnban);
        await PanelAdminPage();
        sweetAlert("L'utilisateur a été débanni avec succès.");
      });
      //refresh the page (click no)
      buttonNo.addEventListener("click", (e) => {
        PanelAdminPage();
      });
    });
  });

    /********
  * Title: How to make a flat design search box | HTML & CSS
  * Author: GeekBase
  * Date: 9/12/21
  * Code version: unknown
  * Availability: https://www.youtube.com/watch?v=csY6KW7cIUM
  */
  //if click the search button of the search bar, refresh page with users matching filter
  let searchButton = document.querySelector("#searchButton");
  let inputSearchBox = document.querySelector("#searchBar");
  searchButton.addEventListener("click", async (e) => {
    //refresh the page with filter in the url and display the users matching the filter
    e.preventDefault();
    RedirectWithParamsInUrl("/PanelAdmin","?filter="+inputSearchBox.value);
  });

  //event listener pressing Enter key on search bar
  inputSearchBox.addEventListener('keydown', listenerPressEnterSearchBar);

  //if click on the email of a user
  main.querySelectorAll(".emailsUsersBox").forEach((emailDisplayed) => {
    emailDisplayed.addEventListener("click", (e) => {
      let elementId = e.target.dataset.elementId;
      let elementEmail = e.target.dataset.elementEmail;
      let elementLongEmail = e.target.dataset.elementLongEmail;
      let hiddenState = document.getElementById("email" + elementId);
      //display whole email
      if (hiddenState.innerHTML == 0) {
        let height = parseInt(elementLongEmail.length / 28 + 1);
        emailDisplayed.style = `height:${height}rm`;
        emailDisplayed.innerHTML = elementLongEmail;
        hiddenState.innerHTML = 1;
      }
      //display a part of email
      else {
        emailDisplayed.style = "height:2rem";
        emailDisplayed.innerHTML = elementEmail;
        hiddenState.innerHTML = 0;
      }
    });
  });
}

/**
 * Make an alert top right
 * @param {String} tilte - the title to display in the alert 
 */
const sweetAlert = (tilte) => {
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
    title: tilte
  })
}

export { PanelAdminPage };
