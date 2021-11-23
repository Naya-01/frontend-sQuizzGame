const homePage = `
<div class="text-center">
  <h3>Bienvenue sur sQuizz Game !</h3>

</div>`;

const HomePage = () => {
  let user = getSessionObject("user");
  if (!user) {
        Redirect("/RegisterAndLoginPage");
  }
  const main = document.querySelector("main");
  main.innerHTML = homePage;
};

export default HomePage;