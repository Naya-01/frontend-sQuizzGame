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
}
export default UserLibrary;