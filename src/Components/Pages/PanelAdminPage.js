import UserLibrary from "../../Domain/UserLibrary";
import { getSessionObject } from "../../utils/session";
import { Redirect,RedirectWithParamsInUrl } from "../Router/Router";
const userLibrary = new UserLibrary();
let filterOfSearch;

const PanelAdminPage = async (filter) => {
  let userSession = getSessionObject("user");
  if (!userSession) {
    Redirect("/RegisterAndLoginPage");
  }

  let user = await userLibrary.getUser(userSession.id_user);
  if (!user.is_admin) Redirect("/");
  else {
    const main = document.querySelector("main");
    if(filter===undefined) filter="";
    filterOfSearch=filter; 
    console.log(filterOfSearch);
    let page = await userLibrary.getPanelAdminPage(filter,userSession);
    main.innerHTML = page;

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

        //listener to unban someone (press yes)
        buttonYes.addEventListener("click", async (e) => {
          const userToBan = {
            id_user: parseInt(elementId),
          };
          await userLibrary.banUser(userToBan);

          PanelAdminPage(filter);
        });
        //refresh the page (press no)
        buttonNo.addEventListener("click", (e) => {
          PanelAdminPage(filter);
        });
      });
    });

    main.querySelectorAll(".linkUsername").forEach(async (button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        let elementId = e.target.dataset.elementId;
        RedirectWithParamsInUrl("/Profil?idUser="+elementId);
      });
    });

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

        //listener to unban someone (press yes)
        buttonYes.addEventListener("click", async (e) => {
          const userToUpgrade = {
            id_user: parseInt(elementId),
          };
          await userLibrary.upgradeUser(userToUpgrade);
          PanelAdminPage(filter);
        });
        //refresh the page (press no)
        buttonNo.addEventListener("click", (e) => {
          PanelAdminPage(filter);
        });
      });
    });

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

        //listener to unban someone (press yes)
        buttonYes.addEventListener("click", async (e) => {
          const userToUnban = {
            id_user: parseInt(elementId),
          };
          await userLibrary.unbanUser(userToUnban);
          PanelAdminPage(filter);
        });
        //refresh the page (press no)
        buttonNo.addEventListener("click", (e) => {
          PanelAdminPage(filter);
        });
      });
    });


    let searchButton = document.querySelector("#searchButton");
    let inputSearchBox = document.querySelector("#searchBar");
    searchButton.addEventListener("click", async (e) => {
      e.preventDefault();
      PanelAdminPage(inputSearchBox.value);
    });
    inputSearchBox.addEventListener('keydown', listenerPressEnterSearchBar);


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
};

const listenerPressEnterSearchBar = async (e) =>{
  if(e.key==="Enter"){
    let inputSearchBox = document.querySelector("#searchBar");
    await PanelAdminPage(inputSearchBox.value);
  } 
}

export { PanelAdminPage };
