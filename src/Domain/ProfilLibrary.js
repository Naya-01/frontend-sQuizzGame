import adminImage from "../img/admin.png";
import userImage from "../img/user.png";

class ProfilLibrary{
    async getMyProfilPage(user){
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

            const quizzs = await this.getQuizzFromUser(user);
            let boxOfQuizz = this.displayQuizzs(quizzs);
            page+= boxOfQuizz;
            return page;
      
        } catch (error) {
            console.error("getMyProfilPage::error: ", error);
        }
    }


    async getQuizzFromUser(user){
        const response = await fetch("/api/quizz/byEmail/"+user); 
      
            if (!response.ok) {
              throw new Error(
                "fetch error : " + response.status + " : " + response.statusText
              );
            }
            const quizzs = await response.json(); 

            return quizzs;
    }

    async deleteQuizzFromProfil(){
        const response = await fetch("/api/quizz/byEmail/"+user); 
      
            if (!response.ok) {
              throw new Error(
                "fetch error : " + response.status + " : " + response.statusText
              );
            }
            const quizzs = await response.json(); 

            return quizzs;
    }

    displayQuizzs(quizzs){
        let boxOfQuizzs ='<div class="row ">'; 
        if(quizzs.length > 0) {
            quizzs.forEach((element) => {
                boxOfQuizzs+=`
                <div class="col">
                    <div class="card m-3" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                            <div class="d-grid gap-2">
                                <button class="btn btn-success" type="button">Jouer</button>
                                <button class="btn btn-danger delete" data-element-id="${element.id_quizz}  type="button">Supprimer</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            });
        }
        boxOfQuizzs+=`
            </div>
        </div>
        `;
        return boxOfQuizzs;

    }
}

export default ProfilLibrary;