import ProfilLibrary from "../../Domain/ProfilLibrary";


const profilLibrary = new ProfilLibrary();

const ProfilPage = async () => {
  const main = document.querySelector("main");
  const page = await profilLibrary.getMyProfilPage("briancarlsone@gmail.com");
  /* TODO
  page.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", (e) => {
      const elementId = e.target.dataset.elementId;
      profilLibrary.deleteQuizzFromProfil();
      ProfilPage();
    });
  });*/


  main.innerHTML = page;
};

export { ProfilPage };
