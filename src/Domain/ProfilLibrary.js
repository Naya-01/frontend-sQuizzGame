import adminImage from "../img/admin.png";
import userImage from "../img/user.png";
import UserLibrary from "./UserLibrary";
import { getSessionObject } from "../utils/session";
import Swal from "sweetalert2";
const userLibrary = new UserLibrary();

class ProfilLibrary {
  /**
   * Get my profil page
   * @returns {String} html profil page of user session  
   */
  async getMyProfilPage() {
    try {
      let user = await userLibrary.getUserOfSessionWithSubs();
      let page = `
        <div class="container">
        <div class="text-center">
            <h1>Mon profil</h1>
        </div>`;
        // if the user in url is admin, display the admin image
        if(user.is_admin) page += `<img src="${adminImage}" class="rounded mx-auto d-block" alt="admin picture" height="350"></img>`;
        //else, display the member image
        else page += `<img src="${userImage}" class="rounded mx-auto d-block" alt="user picture" height="250">`;
        page += `
        <div class="text-center">
          <div><span><strong>Pseudo :</strong> ${user.name}</span></div>
          <div><span><strong>Email :</strong> ${user.email}</span></div>
        </div>
        <div class="row">
            <div class="col-md-6">
            <div class="text-center">
                <h4 id="abonnes">Abonnés</h4>
                <h5>${user.subscribers}</h5>
            </div>
            </div>
            <div class="col-md-6">
            <div class="text-center">
                <h4 id="abonnements">Abonnements</h4>
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

        
      const quizzs = await this.getQuizzFromUser(user,null);

      let boxOfQuizz = await this.displayQuizzs(quizzs,null,user);
      page += boxOfQuizz;
      page += `</div>`;
      return page;
    } catch (error) {
      console.error("getMyProfilPage::error: ", error);
    }
  }

  /**
   * Get pop-up with subscribers or subscriptions
   * display the subscribers or subscriptions
   * @param {Event} e
   */
  async clickOnSubscribersOrSubscriptions(e){
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getSessionObject("user").token,
      },
    };

    // we check if the is not an id user in the url
    let url_string = window.location;
    let url = new URL(url_string);
    let idUserUrl = url.searchParams.get("idUser");
    let id_user;
    if(idUserUrl==null){
      let userSession= await userLibrary.getUserOfSession();
      id_user = userSession.id_user;
    }
    else{
      id_user = parseInt(idUserUrl);
    }

    let followers;
    let title;
    // we get the subscribers or subscriptions
    if(this.id === "abonnes"){
      title="Abonnés";
      followers = await fetch("/api/users/all_followers/"+id_user, options);
    }
    else{
      title="Abonnements";
      followers = await fetch("/api/users/all_subscriptions/"+id_user, options);
    }
    followers = await followers.json();
    let followers_html = '';
    // We put the subscribers or subscriptions in paragraphs
    followers.forEach(function(element){
      followers_html += '<p><a href="/Profil?idUser='+element.id_user+'">'+element.name+'</a></p>';
    });
    // a message is displayed if the list is empty
    if(!followers_html) followers_html += '<p>Aucun pour le moment...</p>';
    // We display the pop-up with the list of subscribers or subscriptions
    Swal.fire({
      title: title,
      html: followers_html,
      padding: '3em',
      color: 'black',
      scrollbarPadding: true,
      backdrop: `  rgba(80,80,80,0.7) `,
      allowOutsideClick: true,
      allowEscapeKey: true,
      width: "80%",
      confirmButtonText: 'Retour',
    })
  }

   /** 
   * @param {Object} userSession - objet of user in session
   * @param {number} idUserUrl - id of user in url
   * @returns {String} html profil page of another one user
   */
  async getAnotherOneProfilPage(userSession,idUserUrl) {
    try {
      let userUrl = await userLibrary.getUser(idUserUrl);
      let page;
      //if the id user in url doesn't exist or, the user session is not admin
      //and the user in url is banned, display page don't found
      if(userUrl===undefined || (!userSession.is_admin && userUrl.banned)){
        page = `
            <div class="in-middle">
              <h1 >Profil introuvable</h1>
            </div>
         `;
          return page;
      }
      let userSessionSubscribers = await userLibrary.getSubscribers(userUrl.id_user);
      let userSessionSubscriptions = await userLibrary.getSubscriptions(userUrl.id_user);
      page = `
          <div class="container">
          <div class="text-center">
              <h1>${userUrl.name}</h1>
          </div>`;
          // if the user in url is admin, display the admin image
          if(userUrl.is_admin) page += `<img src="${adminImage}" class="rounded mx-auto d-block" alt="admin picture" height="350"></img>`;
          //else, display the member image
          else page += `<img src="${userImage}" class="rounded mx-auto d-block" alt="user picture" height="250">`;
          //if the user session is admin, display the email of the user in url
          if(userSession.is_admin) page+=`
            <div class="text-center m-4">
              <div><span><strong>Email :</strong> ${userUrl.email}</span></div>
            </div>`;
          page += `
          <div class="row m-2">
              <div class="col-md-4">
                <div class="text-center">
                    <h4 id="abonnes">Abonnés</h4>
                    <h5>${userSessionSubscribers}</h5>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">`;
                //check if user session if following the user in url
                let bool = await userLibrary.isFollowing(userUrl.id_user,userSession.id_user);
                //if yes, display unsubscribe button
                if(bool==1){
                  page += `<button type="button" class="btn btn-outline-dark" id="unsubscribe" name="unsubscribe" data-element-id-user="${userUrl.id_user}" data-element-id-follower="${userSession.id_user}">Se désabonner</button>`;
                }
                //else, display subscribe button
                else{
                  page += `<button type="button" class="btn btn-outline-dark" id="subscribe" data-element-id-user="${userUrl.id_user}" data-element-id-follower="${userSession.id_user}">S'abonner</button>`;
                }
                  page += `
                  </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">
                    <h4 id="abonnements">Abonnements</h4>
                    <h5>${userSessionSubscriptions}</h5>
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

        
      const quizzs = await this.getQuizzFromUser(userSession, userUrl.id_user);
      let boxOfQuizz = await this.displayQuizzs(quizzs,userUrl,userSession);
      page += boxOfQuizz;
      page += `</div>`;
      return page;
    } catch (error) {
      console.error("getAnotherOneProfilPage::error: ", error);
    }
  }

  /**
   * Get quizzs from a user
   * @param {Object} userSession 
   * @param {number} id_user_url 
   * @returns {String} quizzs of the user in url, otherwhise, of the user session
   */
  async getQuizzFromUser(userSession,id_user_url) {
    try {
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      let response;
      if(!id_user_url){
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

  /**
   * Delete a quizz from the profil
   * @param {number} id_quizz 
   * @returns {boolean} true if deleted
   */
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
        const isDeleted = await response.json(); 
        return isDeleted;
    } catch (err) {
      console.error("deleteQuizzFromProfil::error: ", err);
    }
  }

  /**
   * Display all quizzs
   * @param {Object} quizzs 
   * @param {Object} userUrlObject 
   * @param {Object} userSessionObject 
   * @returns {String} box of quizzs in with all quizzs of user session or a user whose id is in the url
   */
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
                        //if the length of the quizz title is greater than 20 then we shorten it
                        let classToAdd="";
                        let titreQuizz=element.name;
                        if(titreQuizz.length > 20){
                          titreQuizz = titreQuizz.substring(0, 20);
                          titreQuizz += " ...";
                          classToAdd="titlesQuizzBox underline";
                        }
                        //display quizz title
                        boxOfQuizzs += `
                          <h5 class="card-title ${classToAdd}" style ="height:2rem" data-element-id="${element.id_quizz}" data-element-long-name-quizz="${element.name}" data-element-name-quizz="${titreQuizz}">${titreQuizz}</h5>
                          <span id="quizz${element.id_quizz}" hidden>0</span>`;
                        //if there is no user id in the url, the name of the user in
                        //session is displayed
                        if(userUrlObject==null)
                          boxOfQuizzs += `
                          <h6 class="card-subtitle mb-2 text-muted">par ${userSessionObject.name}</h6>`;
                        //if there is a user id in the url, the name of that user is displayed
                        else
                          boxOfQuizzs += `
                          <h6 class="card-subtitle mb-2 text-muted">par ${userUrlObject.name}</h6>`;
                        //if the length of the quizz description is greater than 40 then we shorten it
                        let descriptionTexte=element.description;
                        if(descriptionTexte.length > 40){
                          descriptionTexte = descriptionTexte.substring(0, 40);
                          descriptionTexte += " ...";
                        }
                        //display quizz description
                        boxOfQuizzs += `
                        <p class="card-text" style ="height:4rem">${descriptionTexte}</p>
                        <div class="d-grid gap-2">
                            <span id="delete${element.id_quizz}"></span>`;
                            //if there is a user id in the url and he is banned, we display 
                            //the play button as disabled 
                            if(userUrlObject!=null && userUrlObject.banned){
                              boxOfQuizzs += `<button class="btn btn-secondary play" disabled data-element-id="${element.id_quizz} "type="button">Jouer</button>`;
                            }
                            //else, display play button as usable
                            else{
                              boxOfQuizzs += `<button class="btn btn-primary play" data-element-id="${element.id_quizz} "type="button">Jouer</button>`;
                            }
                            //if there is no user id in the url or if, the user in url 
                            //is not admin and the user session is admin, we display a delete quizz button
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
        console.error("displayQuizzs::error: ", err);
    }
  }
}

export default ProfilLibrary;