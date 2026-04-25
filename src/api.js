// =========================
// API МОДУЛЬ (если хотите разделить код)
// =========================
const BASE_URL = "http://mini-app-backend-production-e37e.up.railway.app";

export async function getGames() {
    const res = await fetch(`${BASE_URL}/games`);
    if (!res.ok) throw new Error("Failed to fetch games");
    return await res.json();
}

export async function addGame(game) {
    const res = await fetch(`${BASE_URL}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game)
    });
    if (!res.ok) throw new Error("Failed to add game");
    return await res.json();
}

export async function deleteGame(id) {
    const res = await fetch(`${BASE_URL}/games/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete game");
}

export async function getWishlist(userId) {
    const res = await fetch(`${BASE_URL}/wishlist/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    return await res.json();
}

export async function addToWishlist(gameId, userId) {
    const res = await fetch(`${BASE_URL}/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, userId })
    });
    if (!res.ok) throw new Error("Failed to add to wishlist");
}

export async function removeFromWishlist(userId, gameId) {
    const res = await fetch(`${BASE_URL}/wishlist/${userId}/${gameId}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to remove from wishlist");
}