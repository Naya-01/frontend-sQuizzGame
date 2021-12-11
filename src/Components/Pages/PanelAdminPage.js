import UserLibrary from "../../Domain/UserLibrary";

const userLibrary = new UserLibrary();

const PanelAdminPage = async (filter) => {
  const main = document.querySelector("main");
  let page = await userLibrary.getPanelAdminPage(filter);
  main.innerHTML = page;
  
  main.querySelectorAll(".ban").forEach(async (button) => {
    button.addEventListener("click", async (e) => {
      let elementId = e.target.dataset.elementId;

      const userToBan = {
        id_user: parseInt(elementId),
      };
      await userLibrary.banUser(userToBan);
      
      PanelAdminPage(filter);
      
    });
  });

  main.querySelectorAll(".upgrade").forEach(async(button) => {
    button.addEventListener("click", async (e) => {
      console.log("upgrade");
      let elementId = e.target.dataset.elementId;

      const userToUpgrade = {
        id_user: parseInt(elementId),
      };
      await userLibrary.upgradeUser(userToUpgrade);
      PanelAdminPage(filter);
    });
  });

  main.querySelectorAll(".unban").forEach(async (button) => {
    button.addEventListener("click", async (e) => {
      let elementId = e.target.dataset.elementId;

      const userToUnban = {
        id_user: parseInt(elementId),
      };
      await userLibrary.unbanUser(userToUnban);
      PanelAdminPage(filter);
    });
  });


  let search = document.querySelector("#searchButton");
  search.addEventListener("click",async (e) => {
    e.preventDefault();
    let inputSearchBox = document.getElementById("seachInput");
    PanelAdminPage(inputSearchBox.value);
    
  });
};



export { PanelAdminPage };
