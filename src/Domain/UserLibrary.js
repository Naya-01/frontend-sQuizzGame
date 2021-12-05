class UserLibrary{
    async isAdmin(user){
        const response = await fetch("/api/"); 
      
            if (!response.ok) {
              throw new Error(
                "fetch error : " + response.status + " : " + response.statusText
              );
            }
        const isAdmin = await response.json(); 
        return isAdmin;
    }

    async isBanned(user){
        const response = await fetch("/api/"); 
      
            if (!response.ok) {
              throw new Error(
                "fetch error : " + response.status + " : " + response.statusText
              );
            }
        const isBanned = await response.json(); 
        return isBanned;
    }

    async getUser(user_email){
      try{
        const reponse = await fetch("/api/users/email/"+user_email); 
      
        if (!reponse.ok) {
          throw new Error(
            "fetch error : " + reponse.status + " : " + reponse.statusText
          );
        }
        const user = await reponse.json(); 
        return user;
        }catch(err){
          console.error("getUser::error: ", err);
        }
  }


}
export default UserLibrary;