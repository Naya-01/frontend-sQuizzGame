import UserLibrary from "../../Domain/UserLibrary";

const userLibrary = new UserLibrary();

const PanelAdminPage = async () => {
  const main = document.querySelector("main");
  let page = await userLibrary.getPanelAdminPage();
  main.innerHTML = page;

  main.querySelectorAll(".ban").forEach((button) => {
    button.addEventListener("click", async (e) => {
      let elementId = e.target.dataset.elementId;
      
      const userToBan = {
        id_user: parseInt(elementId),
      };
      await userLibrary.banUser(userToBan);
      PanelAdminPage();
    });
  });

  main.querySelectorAll(".upgrade").forEach((button) => {
    button.addEventListener("click", async (e) => {
      let elementId = e.target.dataset.elementId;
      
      const userToUpgrade = {
        id_user: parseInt(elementId),
      };
      await userLibrary.upgradeUser(userToUpgrade);
      PanelAdminPage();
    });
  });

  main.querySelectorAll(".unban").forEach((button) => {
    button.addEventListener("click", async (e) => {
      let elementId = e.target.dataset.elementId;
      
      const userToUnban = {
        id_user: parseInt(elementId),
      };
      await userLibrary.unbanUser(userToUnban);
      PanelAdminPage();
    });
  });
};

export { PanelAdminPage };
