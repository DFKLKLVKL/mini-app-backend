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
    } catch (e) {
        console.error(e);
        showToast("Ошибка загрузки игр");
    } finally {
        hideLoader();
    }
    renderGames();
}

async function loadWishlist() {
    try {
        wishlist = await getWishlist(userId);
    } catch (e) {
        console.error(e);
        showToast("Ошибка загрузки вишлиста");
    }
    renderGames();
}

// ================= ADD GAME =================
async function handleAddGame() {
    const name = document.getElementById("name").value.trim();
    const imageUrl = document.getElementById("image").value.trim();
    const appId = parseInt(document.getElementById("appId").value);
    const oldPrice = parseFloat(document.getElementById("oldPrice").value);
    const newPrice = parseFloat(document.getElementById("newPrice").value);

    if (!name) return showToast("Введите название");
    if (!appId) return showToast("Введите AppId");

    const game = {
        appId,
        name,
        imageUrl: imageUrl || "https://placehold.co/400x200",
        oldPrice,
        newPrice,
        discount: 0
    };

    try {
        await addGame(game);
        await loadGames();
    } catch (e) {
        console.error(e);
        showToast("Ошибка добавления");
    }

    // clear form
    ["name", "image", "appId", "oldPrice", "newPrice"]
        .forEach(id => document.getElementById(id).value = "");
}

// ================= RENDER =================
function renderGames() {
    const grid = document.getElementById("gamesGrid");
    if (!grid) return;

    let filtered = [...games];

    if (currentFilter === "wishlist") {
        filtered = filtered.filter(g =>
            wishlist.some(w => w.gameId === g.id)
        );
    }

    if (currentFilter === "high") {
        filtered = filtered.filter(g => (g.discount || 0) >= 70);
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(g =>
            g.name?.toLowerCase().includes(q)
        );
    }

    // stats (safe)
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

            <button onclick="deleteGame(${g.id})">🗑</button></div>
        `;
    }).join("");
}

// ================= GLOBAL ACTIONS =================
window.toggleWishlist = async (gameId) => {
    const exists = wishlist.some(w => w.gameId === gameId);

    try {
        await toggleWishlistAPI(userId, gameId, exists);
        await loadWishlist();
    } catch (e) {
        showToast("Ошибка вишлиста");
    }
};

window.deleteGame = async (id) => {
    try {
        await apiDeleteGame(id);
        await loadGames();
    } catch (e) {
        showToast("Ошибка удаления");
    }
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

// ================= TOAST =================
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
}

// ================= INIT =================
async function init() {
    initTelegram();
    await loadGames();
    await loadWishlist();
}

init();