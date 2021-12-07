class UserLibrary {
  async getPanelAdminPage() {
    try {
      let page = `
        <div class="container">
          <div class="text-center">
              <h1>Gestion administrative</h1>
          </div>`;
      page += await this.displayUsers();
      page += `</div>`;
      return page;
    } catch (err) {
      console.error("getPanelAdminPage::error: ", err);
    }
  }

  async getUser(user_email) {
    try {
      const reponse = await fetch("/api/users/email/" + user_email);

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

  async getUsers() {
    try {
      const reponse = await fetch("/api/users/");

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

  async displayUsers() {
    try {
      const users = await this.getUsers();
      let boxOfUsers = `<div class="row justify-content-md-center">`;
      let fin = users.length;
      if (fin > 0) {
        users.forEach((element) => {
          boxOfUsers += `
            <div class="col-lg-4 col-md-5">
                <div class="card m-3" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${element.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${element.email}</h6>
                        <div class="d-grid gap-2">`;
                        if(element.is_admin){
                          boxOfUsers +=`
                          <button class="btn btn-secondary upgrade " disabled data-element-id="${element.id_user}" type="button">Promouvoir</button>
                          <button class="btn btn-secondary ban " disabled data-element-id="${element.id_user}"  type="button">Bannir</button>`;}
                        else if(element.banned){
                          boxOfUsers +=`
                          <button class="btn btn-success upgrade" disabled data-element-id="${element.id_user}" type="button">Promouvoir</button>
                          <button class="btn btn-primary unban" data-element-id="${element.id_user}"  type="button">Rappeler</button>`;
                        }
                        else{
                        boxOfUsers +=`
                            <button class="btn btn-success upgrade" data-element-id="${element.id_user}" type="button">Promouvoir</button>
                            <button class="btn btn-danger ban" data-element-id="${element.id_user}"  type="button">Bannir</button>`;}
                        boxOfUsers +=`
                        </div>
                    </div>
                </div>
            
            </div>
            `;
        });
        boxOfUsers += `</div>`;
        return boxOfUsers;
      }
    } catch (err) {
      console.error("displayUsers::error: ", err);
    }
  }
}
export default UserLibrary;
