class UserLibrary {
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
      console.error("getUser::error: ", err);
    }
  }

  async displayUsers() {
    try {
      const users = await this.getUsers();
      let boxOfUsers = "";
      let fin = users.length;
      if (fin > 0) {
        boxOfUsers = `
        <div class="container">
          <div class="text-center">
                      <h1>Gestion administrative</h1>
          </div>
          
          <div class="row justify-content-md-center">`;
        users.forEach((element) => {
          boxOfUsers += `
                <div class="col-lg-4 col-md-5">
                    
                    <div class="card m-3" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${element.email}</h6>
                            <div class="d-grid gap-2">
                                <button class="btn btn-success upgrade" data-element-id="${element.id_user}" type="button">Promouvoir</button>
                                <button class="btn btn-danger delete" data-element-id="${element.id_user}"  type="button">Bannir</button>
                            </div>
                        </div>
                    </div>
                
                </div>
            `;
        });
        boxOfUsers += `
            </div>
            </div>
            `;
        return boxOfUsers;
      }
    } catch (err) {
      console.error("getUser::error: ", err);
    }
  }
}
export default UserLibrary;
