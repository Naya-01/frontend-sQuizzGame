import ProfilLibrary from "../../Domain/ProfilLibrary";


const profilLibrary = new ProfilLibrary();

const ProfilPage = async () => {
  const main = document.querySelector("main");
  const page = await profilLibrary.getMyProfilPage("stefanIPL@gmail.com");
  main.innerHTML = page;

  main.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", (e) => {
      let elementId = e.target.dataset.elementId;
      profilLibrary.deleteQuizzFromProfil(elementId);
      ProfilPage();
    });
  });


  
};

export { ProfilPage };
