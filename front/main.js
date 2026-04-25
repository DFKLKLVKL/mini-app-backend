const BASE_URL = "http://mini-app-backend-production-e37e.up.railway.app";
const API_URL = `${BASE_URL}/games`;
const WISHLIST_URL = `${BASE_URL}/wishlist`;

let games = [];
let wishlist = [];
let currentFilter = "all";
let searchQuery = "";

let userId = "guest";

// ================= TELEGRAM =================
function initTelegram() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        userId = user.id.toString();
        document.getElementById("tgUserInfo").innerText =
            user.first_name || "User";
    } else {
        userId = "test-user";
        document.getElementById("tgUserInfo").innerText = "Demo";
    }
}

// ================= API =================
async function loadGames() {
    const res = await fetch(API_URL);
    games = await res.json();
    renderGames();
}

async function loadWishlist() {
    const res = await fetch(`${WISHLIST_URL}/${userId}`);
    wishlist = await res.json();
    renderGames();
}

async function addGame(game) {
    await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(game)
    });

    await loadGames();
}

async function deleteGame(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await loadGames();
}

async function toggleWishlist(gameId) {
    const exists = wishlist.some(w => w.gameId === gameId);

    if (exists) {
        await fetch(`${WISHLIST_URL}/${userId}/${gameId}`, {
            method: "DELETE"
        });
    } else {
        await fetch(WISHLIST_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ gameId, userId })
        });
    }

    await loadWishlist();
}

// ================= ADD GAME =================
async function addGameFromForm() {
    const game = {
        name: document.getElementById("name").value,
        imageUrl: document.getElementById("image").value || "https://placehold.co/400x200",
        oldPrice: +document.getElementById("oldPrice").value,
        newPrice: +document.getElementById("newPrice").value
    };

    await addGame(game);

    document.getElementById("name").value = "";
    document.getElementById("image").value = "";
    document.getElementById("oldPrice").value = "";
    document.getElementById("newPrice").value = "";
}

// ================= UI =================
function renderGames() {
    const grid = document.getElementById("gamesGrid");

    let filtered = [...games];

    if (currentFilter === "wishlist") {
        filtered = filtered.filter(g =>
            wishlist.some(w => w.gameId === g.id)
        );
    }

    if (currentFilter === "high") {
        filtered = filtered.filter(g => g.discount >= 70);
    }

    if (searchQuery) {
        filtered = filtered.filter(g =>
            g.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    document.getElementById("totalGames").innerText = games.length;
    document.getElementById("wishlistCount").innerText = wishlist.length;

    const max = games.length
        ? Math.max(...games.map(g => g.discount || 0))
        : 0;

    document.getElementById("maxDiscount").innerText = max + "%";

    if (filtered.length === 0) {
        grid.innerHTML = "<p>Ничего нет</p>";
        return;
    }

    grid.innerHTML = filtered.map(g => {
        const liked = wishlist.some(w => w.gameId === g.id);

        return `
        <div class="card">
            <img src="${g.imageUrl}">
            <h3>${g.name}</h3>
            <p><s>${g.oldPrice}</s> → ${g.newPrice}</p>
            <p>-${g.discount}%</p>

            <button onclick="toggleWishlist(${g.id})">
                ${liked ? "❤️" : "🤍"}
            </button>

            <button onclick="deleteGame(${g.id})">🗑</button>
        </div>
        `;
    }).join("");
}

// ================= EVENTS =================
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderGames();
    };
});

document.getElementById("searchInput").oninput = e => {
    searchQuery = e.target.value;
    renderGames();
};

document.getElementById("refreshBtn").onclick = async () => {
    await loadGames();
    await loadWishlist();
};

document.getElementById("addBtn").onclick = addGameFromForm;

// ================= INIT =================
async function init() {
    initTelegram();
    await loadGames();
    await loadWishlist();
}

init();