import UserLibrary from "../../Domain/UserLibrary";

const userLibrary = new UserLibrary();

const PanelAdminPage = async () => {
  const main = document.querySelector("main");
  let toReturn = await userLibrary.displayUsers();
  main.innerHTML = toReturn;
};

export { PanelAdminPage };
