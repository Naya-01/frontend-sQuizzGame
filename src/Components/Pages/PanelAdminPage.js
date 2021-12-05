import UserLibrary from "../../Domain/UserLibrary";

const userLibrary = new UserLibrary();

const PanelAdminPage = async () => {
    const main = document.querySelector("main");
    let page = `
        <div class="container">
            <div class="text-center">
                <h1>Gestion administrative</h1>
            </div>`;
    main.innerHTML=page;
}

export { PanelAdminPage };