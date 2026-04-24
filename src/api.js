const API_URL = "http://mini-app-backend-production-e37e.up.railway.app";
const WISHLIST_URL = "http://mini-app-backend-production-e37e.up.railway.app";
export async function getGames(){
    const res = await fetch(API_URL);
    return await res.json();

}

export async function addGames(game) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(game)
    });
    return await res.json();
}
export async function deleteGame(id) {
    await fetch('${API_URL}/${id}', {
        method: "DELETE"
    });
    
}
