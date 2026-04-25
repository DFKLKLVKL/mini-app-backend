import {
    getGames,
    addGame,
    deleteGame as apiDeleteGame,
    getWishlist,
    toggleWishlistAPI
} from "./api.js";

// ================= STATE =================
let games = [];
let wishlist = [];
let currentFilter = "all";
let searchQuery = "";
let userId = "guest";

// ================= TELEGRAM =================
function initTelegram() {
    const tg = window.Telegram?.WebApp;

    if (tg?.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        userId = user.id.toString();

        document.getElementById("tgUserInfo").innerText =
            user.first_name || "User";

        tg.expand();
    } else {
        userId = "test-user";
        document.getElementById("tgUserInfo").innerText = "Demo";
    }
}

// ================= LOADER =================
function showLoader() {
    document.getElementById("loader")?.classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader")?.classList.add("hidden");
}

// ================= DATA =================
async function loadGames() {
    try {
        showLoader();
        games = await getGames();
        renderGames();
    } catch (e) {
        console.error(e);
        showError("Ошибка загрузки игр");
    } finally {
        hideLoader();
    }
}

async function loadWishlist() {
    try {
        showLoader();
        wishlist = await getWishlist(userId);
        renderGames();
    } catch (e) {
        console.error(e);
        showError("Ошибка загрузки вишлиста");
    } finally {
        hideLoader();
    }
}

// ================= ADD GAME =================
async function handleAddGame() {
    const name = document.getElementById("name").value.trim();
    const imageUrl = document.getElementById("image").value.trim();
    const appId = parseInt(document.getElementById("appId").value);
    const oldPrice = parseFloat(document.getElementById("oldPrice").value);
    const newPrice = parseFloat(document.getElementById("newPrice").value);

    if (!name) return showError("Введите название");
    if (!appId) return showError("Введите AppId");

    const game = {
        appId,
        name,
        imageUrl: imageUrl || "https://placehold.co/400x200",
        oldPrice,
        newPrice,
        discount: 0
    };

    await addGame(game);

    document.getElementById("name").value = "";
    document.getElementById("image").value = "";
    document.getElementById("appId").value = "";
    document.getElementById("oldPrice").value = "";
    document.getElementById("newPrice").value = "";

    await loadGames();
}

// ================= RENDER =================
function renderGames() {
    if (!games) return;
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

    // stats
    document.getElementById("totalGames").innerText = games.length;
    document.getElementById("wishlistCount").innerText = wishlist.length;

    const max = games.length
        ? Math.max(...games.map(g => g.discount || 0))
        : 0;

    document.getElementById("maxDiscount").innerText = max + "%";

    if (!filtered.length) {
        grid.innerHTML = "<p>Ничего не найдено</p>";
        return;
    }

    grid.innerHTML = filtered.map(g => {
        const liked = wishlist.some(w => w.gameId === g.id);

        return `
        <div class="card">
            <img src="${g.imageUrl}" 
                 onerror="this.src='https://placehold.co/400x200'">

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

// ================= GLOBAL ACTIONS =================
window.toggleWishlist = async (gameId) => {
    const exists = wishlist.some(w => w.gameId === gameId);

    await toggleWishlistAPI(userId, gameId, exists);
    await loadWishlist();
};

window.deleteGame = async (id) => {
    await apiDeleteGame(id);
    await loadGames();
};

// ================= FILTERS =================
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".filter-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderGames();
    };
});

// ================= SEARCH =================
document.getElementById("searchInput").oninput = (e) => {
    searchQuery = e.target.value;
    renderGames();
};

// ================= BUTTONS =================
document.getElementById("addBtn").onclick = handleAddGame;

document.getElementById("refreshBtn").onclick = async () => {
    await loadGames();
    await loadWishlist();
};

// ================= ERROR =================
function showError(msg) {
    const el = document.createElement("div");
    el.className = "error";
    el.innerText = msg;

    document.body.appendChild(el);

    setTimeout(() => el.remove(), 3000);
}

// ================= INIT =================
async function init() {
    initTelegram();
    await loadGames();
    await loadWishlist();
}

init();