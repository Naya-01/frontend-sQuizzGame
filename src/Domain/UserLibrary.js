class UserLibrary {
  async getPanelAdminPage(filter,userSession) {
    try {
      if(filter===undefined) filter="";
      let page = `
        <div class="container">
          <div class="text-center">
              <h1>Gestion administrative</h1>
          </div>
          <div class="boxContainer">
              <table class="elementsContainer">
                  <tr>
                      <td>
                          <input type="text" placeholder="Chercher" class="search" name="searchBar" id="searchBar" value="${filter}">
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
          </div>
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

  async getUsersWithFilter(filter) {
    try {
      
      const reponse = await fetch("/api/users/filter/"+filter);

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

  async getUser(id) {
    try {
      const reponse = await fetch("/api/users/" + id);

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
   * 
   * @param integer id_user 
   * @paraminteger id_follower 
   * @returns 1 if id_follower is following id_user
   */
  async isFollowing(id_user,id_follower) {
    try {
      const reponse = await fetch(`/api/users/isFollowing/ids?id1=${id_user}&id2=${id_follower}`);

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

  async subscribe(users) {
    try {
      if(!users) return false;
      const options = {
        method: "POST", 
        body: JSON.stringify(users),
        headers: {
          "Content-Type": "application/json",
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
      console.error("getUser::error: ", err);
    }
  }

  async unsubscribe(id_user,id_follower) {
    try {
      const options = {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
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

  async getTwoUsersById(id1,id2) {
    try {
      const reponse = await fetch(`/api/users/getTwoUsers/ids?id1=${id1}&id2=${id2}`);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const users = await reponse.json();
      return users;
    } catch (err) {
      console.error("getUser::error: ", err);
    }
  }
  

  async getUsers() {
    try {
      const reponse = await fetch("/api/users//");

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

  async getSubscribers(id_user) {
    try {
      const reponse = await fetch("/api/users/subscribers/"+id_user);

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

  async getSubscriptions(id_user) {
    try {
      const reponse = await fetch("/api/users/subscriptions/"+id_user);

      if (!reponse.ok) {
        throw new Error(
          "fetch error : " + reponse.status + " : " + reponse.statusText
        );
      }
      const nb = await reponse.json();
      return nb.count;
    } catch (err) {
      console.error("getSubscriptions::error: ", err);
    }
  }

  async banUser(user_object) {
    try {

      const options = {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(user_object),
        headers: {
          "Content-Type": "application/json",
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

  async upgradeUser(user_object) {
    try {

      const options = {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(user_object),
        headers: {
          "Content-Type": "application/json",
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
      console.error("banUser::error: ", err);
    }
  }

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

  

  async unbanUser(user_object) {
    try {

      const options = {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(user_object),
        headers: {
          "Content-Type": "application/json",
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

  async displayUsers(users,userSession) {
    try {
      
      let boxOfUsers = `<div class="row justify-content-md-center">`;
      let fin = users.length;
      if (fin > 0) {
        users.forEach((element) => {
          if(element.id_user!==userSession.id_user){
            boxOfUsers += `
              <div class="col-lg-4 col-md-5">
                  <div class="card m-3" style="width: 18rem;">
                      <div class="card-body">
                          <a href="#" ><h5 class="card-title linkUsername" data-element-id="${element.id_user}">${element.name}</h5></a>`;
                          let descriptionTexte = element.email;
                          if(descriptionTexte.length > 60){
                            descriptionTexte = descriptionTexte.substring(0, 55);
                            descriptionTexte += " ...";
                          }
                          boxOfUsers += `
                          <h6 class="card-subtitle mb-2 text-muted emailsUsersBox underline" style ="height:2rem" data-element-id="${element.id_user}" data-element-long-email="${element.email}" data-element-email="${descriptionTexte} ">${descriptionTexte}</h6>
                          <span id="email${element.id_user}" hidden>0</span>`;
                          boxOfUsers += `
                          <div class="d-grid gap-2">`;
                          if(element.is_admin){
                            boxOfUsers +=`
                            <span class="card-text">Role : Admin</span>
                            <button class="btn btn-secondary upgrade " disabled data-element-id="${element.id_user}" type="button">Promouvoir</button>
                            <button class="btn btn-secondary ban " disabled data-element-id="${element.id_user}"  type="button">Bannir</button>`;}
                          else if(element.banned){
                            boxOfUsers +=`
                            <span class="card-text">Role : Banni</span>
                            <span id="ban${element.id_user}"></span>
                            
                            <button class="btn btn-secondary upgrade" disabled data-element-id="${element.id_user}" type="button">Promouvoir</button>
                            <button class="btn btn-primary unban" data-element-id="${element.id_user}"  type="button">Debannir</button>
                            `;
                            
                          }
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
}
export default UserLibrary;
