const BASE_URL = "http://mini-app-backend-production-e37e.up.railway.app";

// ========== GAMES ==========
export async function getGames() {
    const res = await fetch(`${BASE_URL}/games`);
    return await res.json();
}

export async function addGame(game) {
    const res = await fetch(`${BASE_URL}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game)
    });

    return await res.json();
}

export async function deleteGame(id) {
    await fetch(`${BASE_URL}/games/${id}`, {
        method: "DELETE"
    });
}

// ========== WISHLIST ==========
export async function getWishlist(userId) {
    const res = await fetch(`${BASE_URL}/wishlist/${userId}`);
    return await res.json();
}

export async function toggleWishlistAPI(userId, gameId, exists) {
    if (exists) {
        await fetch(`${BASE_URL}/wishlist/${userId}/${gameId}`, {
            method: "DELETE"
        });
    } else {
        await fetch(`${BASE_URL}/wishlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, gameId })
        });
    }
}