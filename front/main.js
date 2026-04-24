let games = [];
let wishlist = [];
let currentFilter = "all";
let searchQuery = "";

const API_URL = "http://mini-app-backend-production-e37e.up.railway.app";
const WISHLIST_URL = "http://mini-app-backend-production-e37e.up.railway.app";
const userId = "telegram-test-user";

const BASE_URL = "http://mini-app-backend-production-e37e.up.railway.app";

const API_URL = '${BASE_URL}/games';
const WISHLIST_URL = '${BASE_URL}/wishlist';

let games = [];
let wishlist = [];
let currentFilter = "all";
let searchQuery = "";

// временно (потом заменим на Telegram)
const userId = "test-user";
console.log("userId:" , userId);


let userId = "guest";
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    const user = Telegram.WebApp.initDataUnsafe?.user;
    if(user && userId){
        userId = user.id.toString();
    }
}
/* =========================
   ЗАГРУЗКА ИГР
========================= */
async function loadGames() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            throw new Error("Ошибка загрузки игр");
        }

        games = await res.json();
        renderGames();

    } catch (error) {
        console.error("loadGames error:", error);
    }
}

/* =========================
   ЗАГРУЗКА WISHLIST
========================= */
async function loadWishlist() {
    try {
        const res = await fetch(`${WISHLIST_URL}/${userId}`);

        if (!res.ok) {
            throw new Error("Ошибка загрузки wishlist");
        }

        wishlist = await res.json();

    } catch (error) {
        console.error("loadWishlist error:", error);
    }
}
/* =========================
   TOGGLE WISHLIST
========================= */
async function toggleWishlist(gameId) {
    const exists = wishlist.some(w => w.gameId === gameId);

    if (exists) {
        await fetch(`${WISHLIST_URL}/${userId}/${gameId}`, {
            method: "DELETE"
        });
    } else {
        await fetch(WISHLIST_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gameId: gameId,
                userId: userId
            })
        });
    }

    await loadWishlist();
    renderGames();
}

/* =========================
   УДАЛЕНИЕ ИГРЫ
========================= */
async function deleteGame(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    await loadGames();
}

/* =========================
   ДОБАВЛЕНИЕ ИГРЫ
========================= */
async function addGame(game) {
    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(game)
    });

    await loadGames();
}

/* =========================
   ОТОБРАЖЕНИЕ ИГР
========================= */
function renderGames() {
    const grid = document.getElementById("gamesGrid");

    let filtered = [...games];

    // wishlist фильтр
    if (currentFilter === "wishlist") {
        filtered = filtered.filter(g =>
            wishlist.some(w => w.gameId === g.id)
        );
    }

    // скидки
    if (currentFilter === "high") {
        filtered = filtered.filter(g => g.discount >= 70);
    }

    // поиск
    if (searchQuery) {
        filtered = filtered.filter(g =>
            g.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // счётчики
    document.getElementById("totalGames").innerText = games.length;
    document.getElementById("wishlistCount").innerText = wishlist.length;

    const max = games.length > 0
        ? Math.max(...games.map(g => g.discount || 0))
        : 0;

    document.getElementById("maxDiscount").innerText = "-" + max + "%";

    // рендер карточек
    grid.innerHTML = filtered.map(g => {

        const isWishlisted = wishlist.some(w => w.gameId === g.id);

        return `
            <div class="game-card">

                <img class="game-img"
                     src="${g.imageUrl || 'https://placehold.co/400x150'}">

                <h3>${g.name}</h3>

                <p><s>${g.oldPrice}</s> → ${g.newPrice}</p>

                <p>-${g.discount}%</p>

                <button onclick="toggleWishlist(${g.id})">
                    ${isWishlisted ? "★ Удалить" : "☆ В вишлист"}
                </button>

                <button onclick="deleteGame(${g.id})">
                    🗑 Удалить
                </button>

            </div>
        `;
    }).join("");
}

/* =========================
   ФИЛЬТРЫ
========================= */
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".filter-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderGames();
    };
});

/* =========================
   ПОИСК
========================= */
document.getElementById("searchInput").oninput = (e) => {
    searchQuery = e.target.value;
    renderGames();
};

/* =========================
   РЕФРЕШ
========================= */
document.getElementById("refreshBtn").onclick = async () => {
    await loadGames();
    await loadWishlist();
};

/* =========================
   СТАРТ
========================= */
async function init() {
    await loadGames();
    await loadWishlist();
}

init();