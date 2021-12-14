import adminImage from "../img/admin.png";
import userImage from "../img/user.png";
import UserLibrary from "./UserLibrary";
import { getSessionObject } from "../utils/session";
const userLibrary = new UserLibrary();

class ProfilLibrary {
  async getMyProfilPage(userSession) {
    try {
      let user = await userLibrary.getUser(userSession.id_user);
      let page = `
        <div class="container">
        <div class="text-center">
            <h1>Mon profil</h1>
        </div>`;
        if(user.is_admin) page += `<img src="${adminImage}" class="rounded mx-auto d-block" alt="admin picture" height="350"></img>`;
        else page += `<img src="${userImage}" class="rounded mx-auto d-block" alt="user picture" height="250">`;
        page += `
        <div class="text-center">
          <div><span><strong>Pseudo :</strong> ${user.name}</span></div>
          <div><span><strong>Email :</strong> ${user.email}</span></div>
        </div>
        <div class="row">
            <div class="col-md-6">
            <div class="text-center">
                <h4>Abonnés</h4>
                <h5>${user.subscribers}</h5>
            </div>
            </div>
            <div class="col-md-6">
            <div class="text-center">
                <h4>Abonnements</h4>
                <h5>${user.subscriptions}</h5>
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

        
      const quizzs = await this.getQuizzFromUser(userSession,null);

      let boxOfQuizz = await this.displayQuizzs(quizzs,null,user);
      page += boxOfQuizz;
      page += `</div>`;
      return page;
    } catch (error) {
      console.error("getMyProfilPage::error: ", error);
    }
  }

  async getAnotherOneProfilPage(userSession,idUserUrl) {
    try {
      let users = await userLibrary.getTwoUsersById(parseInt(userSession.id_user),parseInt(idUserUrl));
      let page;
      if(users===undefined){
        page = `
            <div class="in-middle">
              <h1 >Profil introuvable</h1>
            </div>
         `;
          return page;
      }
      page = `
          <div class="container">
          <div class="text-center">
              <h1>${users.name2}</h1>
          </div>`;
          if(users.is_admin2) page += `<img src="${adminImage}" class="rounded mx-auto d-block" alt="admin picture" height="350"></img>`;
          else page += `<img src="${userImage}" class="rounded mx-auto d-block" alt="user picture" height="250">`;
          if(users.is_admin1) page+=`
            <div class="text-center m-4">
              <div><span><strong>Email :</strong> ${users.email2}</span></div>
            </div>`;
          page += `
          <div class="row m-2">
              <div class="col-md-4">
                <div class="text-center">
                    <h4>Abonnés</h4>
                    <h5>${users.subscribers}</h5>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">`;
                let bool = await userLibrary.isFollowing(users.id_user2,users.id_user1);
                if(bool==1){
                  page += `<button type="button" class="btn btn-outline-dark" id="unsubscribe" name="unsubscribe" data-element-id-user="${users.id_user2}" data-element-id-follower="${users.id_user1}">Se désabonner</button>`;
                }
                else{
                  page += `<button type="button" class="btn btn-outline-dark" id="subscribe" data-element-id-user="${users.id_user2}" data-element-id-follower="${users.id_user1}">S'abonner</button>`;
                }
                  page += `
                  </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">
                    <h4>Abonnements</h4>
                    <h5>${users.subscriptions}</h5>
                </div>
              </div>
          </div>
          <div class="d-grid gap-3">
              <div class="p-4 bg-light border">
              <div class="text-center">
                  <h5>Les quizz</h5>
              </div>
              </div>
          </div>`;

        
      const quizzs = await this.getQuizzFromUser(userSession, users.id_user2);
      const userUrlObject={
        id_user: users.id_user2,
        name: users.name2,
        email: users.email2,
        password: users.password2,
        banned: users.banned2,
        is_admin: users.is_admin2
      }
      const userSessionObject={
        id_user: users.id_user1,
        name: users.name1,
        email: users.email1,
        password: users.password1,
        banned: users.banned1,
        is_admin: users.is_admin1
      }
      let boxOfQuizz = await this.displayQuizzs(quizzs,userUrlObject,userSessionObject);
      page += boxOfQuizz;
      page += `</div>`;
      return page;
    } catch (error) {
      console.error("getAnotherOneProfilPage::error: ", error);
    }
  }

  async getQuizzFromUser(userSession,id_user_url) {
    try {
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: userSession.token,
        },
      };
      let response;
      if(id_user_url===null){
        response = await fetch("/api/quizz/forUser/" + userSession.id_user,options);
      }
      else{
         response = await fetch("/api/quizz/forUser/" + id_user_url,options);
      }
      

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
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };

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

    async displayQuizzs(quizzs,userUrlObject,userSessionObject) {
        try{
            let boxOfQuizzs = '<div class="row justify-content-md-center">';
            let fin = quizzs.length;
            if (fin > 0) {
                quizzs.forEach((element) => {
              
                  boxOfQuizzs += `
                      <div class="col-lg-4 col-md-5">
                          
                          <div class="card m-3" style="width: 18rem;">
                              <div class="card-body">`;
                                  let titreQuizz=element.name;
                                  if(titreQuizz.length > 20){
                                    titreQuizz = titreQuizz.substring(0, 20);
                                    titreQuizz += " ...";
                                  }
                                  boxOfQuizzs += `
                                    <h5 class="card-title titlesQuizzBox underline" style ="height:2rem" data-element-id="${element.id_quizz}" data-element-long-name-quizz="${element.name}" data-element-name-quizz="${titreQuizz}">${titreQuizz}</h5>
                                    <span id="quizz${element.id_quizz}" hidden>0</span>`;
                                    
                                  if(userUrlObject==null)
                                    boxOfQuizzs += `
                                    <h6 class="card-subtitle mb-2 text-muted">par ${userSessionObject.name}</h6>`;
                                  else
                                    boxOfQuizzs += `
                                    <h6 class="card-subtitle mb-2 text-muted">par ${userUrlObject.name}</h6>`;
                                  let descriptionTexte=element.description;
                                  if(descriptionTexte.length > 40){
                                    descriptionTexte = descriptionTexte.substring(0, 40);
                                    descriptionTexte += " ...";
                                  }
                                  boxOfQuizzs += `
                                  <p class="card-text" style ="height:4rem">${descriptionTexte}</p>
                                  <div class="d-grid gap-2">
                                      <button class="btn btn-primary play" data-element-id="${element.id_quizz} "type="button">Jouer</button>`;
                                      if(userUrlObject==null || (!userUrlObject.is_admin && userSessionObject.is_admin)){
                                        boxOfQuizzs += `<button class="btn btn-danger delete" data-element-id="${element.id_quizz}"  type="button">Supprimer</button>`;
                                      }
                                  boxOfQuizzs +=
                                  `</div>
                              </div>
                          </div>
                      
                      </div>
                  `;
                    
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