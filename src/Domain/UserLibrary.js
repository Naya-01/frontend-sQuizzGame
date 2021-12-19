import { getSessionObject } from "../utils/session";
class UserLibrary {
  /**
   * Get panel admin page
   * @param {String} filter - filter of research 
   * @param {Object} userSession - user objet of session 
   * @returns {String} html panel admin page 
   */
  async getPanelAdminPage(filter,userSession) {
    try {
      let searchBox = this.getSearchBox(filter);
      let page = `
        <div class="container">
          <div class="text-center">
              <h1>Gestion administrative</h1>
          </div>
          ${searchBox}        
          <h3>`;
          if(!filter) page +="Tous les utilisateurs"; else page +=`Recherche : ${filter}`;
          page += `
          </h3>
          <div id="users">
      `;
      let users;
      if(!filter) users = await this.getUsers();
      else users = await this.getUsersWithFilter(filter);
      page += await this.displayUsers(users,userSession);

    
      page += `
        </div>
      </div>`;
      return page;
    } catch (err) {
      console.error("getPanelAdminPage::error: ", err);
    }
  }

  /**
   * Title: How to make a flat design search box | HTML & CSS
   * Author: GeekBase
   * Date: 9/12/21
   * Code version: unknown
   * Availability: https://www.youtube.com/watch?v=csY6KW7cIUM
   * @param {String} filter - filter of research
   * @returns {searchBox} searchbox html
   */
  getSearchBox(filter){
    let searchBox = `
    <div class="boxContainer">
      <table class="elementsContainer">
        <tr>
          <td>
            <input type="text" placeholder="Rechercher" class="search" name="searchBar" id="searchBar" value="${filter}">
          </td>
          <td>
            <a href="#" id="searchButton">
              <span class="material-icons">
                search
              </span>
            </a>
          </td>
        </tr>
      </table>
    </div>`;
    return searchBox;
  }

  /**
   * Get all users matching the filter
   * @param {String} filter - filter of the research
   * @returns {Array} all users matching the filter
   */
  async getUsersWithFilter(filter) { 
    try {
      const options = {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      const reponse = await fetch("/api/users/filter/"+filter,options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const users = await reponse.json();
      return users;
    } catch (err) {
      console.error("getUsersWithFilter::error: ", err);
    }
  }

  async getUser(id) {// profilLibrary et panelAdmin
    try {
      const options = {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      const reponse = await fetch("/api/users/" + id,options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const user = await reponse.json();
      return user;
    } catch (err) {
      console.error("getUser::error: ", err);
    }
  }

  /**
   * Get the user of the session
   * @returns {Object} user of the session
   */
  async getUserOfSession() {
    try {
      const options = {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      const reponse = await fetch("/api/users/getUserSession/",options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const user = await reponse.json();
      return user;
    } catch (err) {
      console.error("getUserOfSession::error: ", err);
    }
  }

  /**
   * Get the user of the session with his subsribers and subscriptions
   * @returns {Object} user of session with his subs and subscriptions
   */
  async getUserOfSessionWithSubs() {
    try {
      const options = {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      const reponse = await fetch("/api/users/getUserSessionWithSubs/",options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const user = await reponse.json();
      return user;
    } catch (err) {
      console.error("getUserOfSessionWithSubs::error: ", err);
    }
  }

  /**
   * Checj if a user is following another one
   * @param integer id_user 
   * @paraminteger id_follower 
   * @returns 1 if id_follower is following id_user
   */
  async isFollowing(id_user,id_follower) { 
    try {
      const options = {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      const reponse = await fetch(`/api/users/isFollowing/ids?id1=${id_user}&id2=${id_follower}`,options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const bool = await reponse.json();
      return bool;
    } catch (err) {
      console.error("isFollowing::error: ", err);
    }
  }

  /**
   * Subscribe to a user
   * @param {Object} users - user follower and who will be followed 
   * @returns {Object} user follower and who will be followed 
   */
  async subscribe(users) { 
    try {
      if(!users) return false;
      const options = {
        method: "POST", 
        body: JSON.stringify(users),
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };

      const reponse = await fetch("/api/users/subscribe",options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const usersToReturn = await reponse.json();
      return usersToReturn;
    } catch (err) {
      console.error("subscribe::error: ", err);
    }
  }

  /**
   * Unsubscribe to a user
   * @param {Object} users - user follower and who will be unfollowed 
   * @returns {Object} user follower and who will be unfollowed 
   */
  async unsubscribe(id_user,id_follower) {
    try {
      const options = {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      const reponse = await fetch(`/api/users/delete/subscription?id_user=${id_user}&id_follower=${id_follower}`,options);


      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const usersToReturn = await reponse.json();
      return usersToReturn;
    } catch (err) {
      console.error("unsubscribe::error: ", err);
    }
  }

  /**
   * Get 2 users but getting the number of subscribers and subscriptions for the id2 in addition
   * user1 = user session
   * user2 = user in the url, with 2 more columns (subscriptions and subscribers)
   * @param {number} id1 - id of first user 
   * @param {number} id2 - id of second user we want his subscriber and subscriptions too
   * @returns {object} object having 2 users, the 2nd one with the subscribers and subscriptions, the 2st one simple data, and if no tuple then undefined
   */
  async getTwoUsersById(id1,id2) {
    try {
      const options = {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      const reponse = await fetch(`/api/users/getTwoUsers/ids?id1=${id1}&id2=${id2}`,options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const users = await reponse.json();
      return users;
    } catch (err) {
      console.error("getTwoUsersById::error: ", err);
    }
  }
  

  /**
   * Get all resources (users)
   * @returns {Array} Array of resources
   */
  async getUsers() { 
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };

      const reponse = await fetch("/api/users/",options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const user = await reponse.json();
      return user;
    } catch (err) {
      console.error("getUsers::error: ", err);
    }
  }

  /**
   * Get number of subscribers of a user
   * @param {number} id_user - id of user to get subscribers 
   * @returns {number} number of subscribers of the id_user
   */
  async getSubscribers(id_user) {
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      const reponse = await fetch("/api/users/subscribers/"+id_user, options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const nb = await reponse.json();
      return nb.count;
    } catch (err) {
      console.error("getSubscribers::error: ", err);
    }
  }

  /**
   * Get number of subscriptions of a user
   * @param {number} id_user - id of user to get subscriptions
   * @returns {number} number of subscriptions of the id_user
   */
  async getSubscriptions(id_user) {
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };
      const reponse = await fetch("/api/users/subscriptions/"+id_user, options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const nb = await reponse.json();
      console.log(nb[0].nbAbonnements);
      
      return nb[0].nbAbonnements;
    } catch (err) {
      console.error("getSubscriptions::error: ", err);
    }
  }

  /**
   * Ban a user
   * @param {Object} user_object - object of the user we want to ban
   * @returns {boolean} true if the user is not ban or not admin yet, false otherwise
   */ 
  async banUser(user_object) {
    try {

      const options = {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(user_object),
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };

      const reponse = await fetch("/api/users/ban",options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const user = await reponse.json();
      return user;
    } catch (err) {
      console.error("banUser::error: ", err);
    }
  }

  /**
   * Upgrade a user by id
   * @param {Object} user_object - object of the user we want to upgrade
   * @returns {boolean} true if the user has been upgraded into admin
   */ 
  async upgradeUser(user_object) { // utilisé panel admin
    try {

      const options = {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(user_object),
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };

      const reponse = await fetch("/api/users/upAdmin",options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const user = await reponse.json();
      return user;
    } catch (err) {
      console.error("upgradeUser::error: ", err);
    }
  }

  /**
   * Check if a user is admin by id
   * @param {number} id_user - id of the user we want to know if is admin
   * @returns {boolean} true if user is admin
   */ 
  async isAdmin(id_user) { 
    try {

      const reponse = await fetch("/api/users/isAdmin/"+id_user);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const bool = await reponse.json();
      return bool;
    } catch (err) {
      console.error("isAdmin::error: ", err);
    }
  }

  
  /**
   * Unban a user
   * @param {Object} user_object - object of the user we want to ban
   * @returns {boolean} true if the user is not banned, false otherwise
   */ 
  async unbanUser(user_object) {//utilisé dans panel admin
    try {

      const options = {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(user_object),
        headers: {
          "Content-Type": "application/json",
          Authorization: getSessionObject("user").token,
        },
      };

      const reponse = await fetch("/api/users/unban",options);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const bool = await reponse.json();
      return bool;
    } catch (err) {
      console.error("unbanUser::error: ", err);
    }
  }

  /**
   * Display all users in html with ban, unban, and upgrade buttons.
   * @param {Object} users - all users of the DB
   * @param {Object} userSession - object of user of the session
   * @returns {String} html of all users
   */
  async displayUsers(users,userSession) {
    try {
      
      let boxOfUsers = `<div class="row justify-content-md-center">`;
      let fin = users.length;
      if(fin==1 && users[0].id_user===userSession.id_user) return "Aucun résultat pour cette recherche";
      else if (fin > 0) {
        users.forEach((element) => {
          if(element.id_user!==userSession.id_user){
            boxOfUsers += `
              <div class="col-lg-4 col-md-5">
                  <div class="card m-3" style="width: 18rem;">
                      <div class="card-body">
                          <a href="#" ><h5 class="card-title linkUsername" data-element-id="${element.id_user}">${element.name}</h5></a>`;
                           //if the length of the user email is greater than 60 then we shorten it
                          let classToAdd="";
                          let descriptionTexte = element.email;
                          if(descriptionTexte.length > 60){
                            descriptionTexte = descriptionTexte.substring(0, 55);
                            descriptionTexte += " ...";
                            classToAdd="emailsUsersBox underline";
                          }
                          //display user email
                          boxOfUsers += `
                          <h6 class="card-subtitle mb-2 text-muted ${classToAdd}" style ="height:2rem" data-element-id="${element.id_user}" data-element-long-email="${element.email}" data-element-email="${descriptionTexte} ">${descriptionTexte}</h6>
                          <span id="email${element.id_user}" hidden>0</span>`;
                          
                          boxOfUsers += `
                          <div class="d-grid gap-2">`;
                          //is the user is admin, can do nothing
                          if(element.is_admin){
                            boxOfUsers +=`
                            <span class="card-text m-1">Role : Admin</span>
                            <button class="btn btn-secondary upgrade " disabled data-element-id="${element.id_user}" type="button">Promouvoir</button>
                            <button class="btn btn-secondary ban " disabled data-element-id="${element.id_user}"  type="button">Bannir</button>`;}
                            //if the user is banned, display unban button
                            else if(element.banned){
                            boxOfUsers +=`
                            <span class="card-text">Role : Banni</span>
                            <span id="ban${element.id_user}"></span>
                            
                            <button class="btn btn-secondary upgrade" disabled data-element-id="${element.id_user}" type="button">Promouvoir</button>
                            <button class="btn btn-primary unban" data-element-id="${element.id_user}"  type="button">Debannir</button>
                            `;
                            
                          }
                          //if the user is member, display upgrade and ban buttons
                          else{
                          boxOfUsers +=`
                            <span class="card-text">Role : Membre</span>
                            <span id="user${element.id_user}"></span>
                              <button class="btn btn-success upgrade" data-element-id="${element.id_user}" type="button">Promouvoir</button>
                              <button class="btn btn-danger ban" data-element-id="${element.id_user}"  type="button">Bannir</button>`;}
                          boxOfUsers +=`
                          </div>
                      </div>
                  </div>
              
              </div>
            `;
          }
              
        });
        boxOfUsers += `</div>`;
        return boxOfUsers;
      }
      else{
        return "Aucun résultat pour cette recherche";
      }
    } catch (err) {
      console.error("displayUsers::error: ", err);
    }
  }

  /**
   * Check if a user exists by email
   * @param {String} email - email of the user
   * @returns {boolean} true if the user exists, else otherwise
   */
  async userExist(email){ 
    try {
      const reponse = await fetch("/api/users/userExist/" + email);

      if (!reponse.ok) {
        throw new Error(
            "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const user = await reponse.json();
      return user;
    } catch (err) {
      console.error("userExist::error: ", err);
    }
  }

  /**
   * Check if the password is correct for the user email
   * @param {String} email - email of the user
   * @param {String} password - password of the user
   * @returns {boolean} true if the password is correct, false otherwise
   */
  async passwordMatch(email,password){ 
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("/api/users/matchPass", options);
      if (!response.ok) {
        throw new Error(
            "fetch error : " + response.status + " : " + response.statusText
        );
      }
      return await response.json();
    } catch (err) {
      console.error("passwordMatch::error: ", err);
    }
  }

  /**
   * Check if a user is banned by email
   * @param {String} email - email of the user we want to know if banned
   * @returns {boolean} true if user is banned
   */
  async isBanned(email){ 
    try {
      const reponse = await fetch("/api/users/isBanned/email/" + email);

      if (!reponse.ok) {
        throw new Error(
            "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const user = await reponse.json();
      return user.banned;
    } catch (err) {
      console.error("isBanned::error: ", err);
    }
  }

}
export default UserLibrary;