import adminImage from "../img/admin.png";
import userImage from "../img/user.png";
import UserLibrary from "./UserLibrary";
const userLibrary = new UserLibrary();

class ProfilLibrary {
  async getMyProfilPage(user_email) {
    try {
      let page = `
                <div class="container">
                <div class="text-center">
                    <h1>Mon profil</h1>
                </div>
                <!--<img src="${adminImage}" class="rounded mx-auto d-block" alt="admin picture" height="400">-->
                <img src="${userImage}" class="rounded mx-auto d-block" alt="user picture" height="300">
                <div class="row">
                    <div class="col-md-6">
                    <div class="text-center">
                        <h4>Abonnés</h4>
                        <h5>20080</h5>
                    </div>
                    </div>
                    <div class="col-md-6">
                    <div class="text-center">
                        <h4>Abonnements</h4>
                        <h5>20080</h5>
                    </div>
                    </div>
                </div>
                <div class="d-grid gap-3">
                    <div class="p-4 bg-light border">
                    <div class="text-center">
                        <h5>Mes quizz</h5>
                    </div>
                    </div>
                </div>`;

        
      const quizzs = await this.getQuizzFromUser(user_email);

      let boxOfQuizz = await this.displayQuizzs(quizzs,user_email);
      page += boxOfQuizz;
      page += `</div>`;
      return page;
    } catch (error) {
      console.error("getMyProfilPage::error: ", error);
    }
  }

  async getQuizzFromUser(user) {
    try {
      const response = await fetch("/api/quizz/byEmail/" + user);

      if (!response.ok) {
        throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
        );
      }
      const quizzs = await response.json();

      return quizzs;
    } catch (err) {
      console.error("getQuizzFromUser::error: ", err);
    }
  }

  async deleteQuizzFromProfil(id_quizz) {
    try {
      const options = {
        method: "DELETE",
        };

        console.log("options:", options);
        const response = await fetch("/api/quizz/"+id_quizz, options);

        if (!response.ok) {
        throw new Error(
            "fetch error : " + response.status + " : " + response.statusText
        );
        }
        const isDeleted = await response.json(); // json() returns a promise => we wait for the data
        return isDeleted;
    } catch (err) {
      console.error("deleteQuizzFromProfil::error: ", err);
    }
  }

    async displayQuizzs(quizzs,user_email) {
        try{
            let pseudo = await userLibrary.getUser(user_email);
            let boxOfQuizzs = '<div class="row justify-content-md-center">';
            let fin = quizzs.length;
            if (fin > 0) {
                quizzs.forEach((element) => {
                    if(!element.is_deleted){
                        boxOfQuizzs += `
                            <div class="col-lg-4 col-md-5">
                                
                                <div class="card m-3" style="width: 18rem;">
                                    <div class="card-body">
                                        <h5 class="card-title">${element.name}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">par ${pseudo.name}</h6>
                                        <p class="card-text">${element.description}</p>
                                        <div class="d-grid gap-2">
                                            <button class="btn btn-success" type="button">Jouer</button>
                                            <button class="btn btn-danger delete" data-element-id="${element.id_quizz}"  type="button">Supprimer</button>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                        `;
                    }
                });
                boxOfQuizzs += `
                    </div>
                    `;
            }
            return boxOfQuizzs;
        }catch(err){
            console.error("getUser::error: ", err);
        }
  }
}

export default ProfilLibrary;
