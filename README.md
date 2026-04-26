
## Архитектура проекта / Architecture of the project

**Stack:**  
- **Backend:** ASP.NET Core (Web API)  
- **Frontend:** Vanilla JS, HTML, CSS   
- **Database:** EF Core + SQL (из наличия `AppDbContext`)  

**Layers:**  
1. **Controllers** — обработка HTTP-запросов (`GamesController`, `WishlistController`).  
2. **Services** — бизнес-логика (`GameService`, `SteamService`, `PriceUpdater`).  
3. **DTO** — передача данных между клиентом и сервером.  
4. **Models** — сущности БД (`Game`, `WishList`, `SteamResponse`).  
5. **Data** — контекст БД (`AppDbContext`).  
6. **Frontend** — статические файлы (`api.js`, `style.css`, `app.html`).

**Основной поток:**  
Frontend → API Controllers → Services → Database / External Steam API → Response.

---

## Что было сделано / What has been done

- Разработана базовая архитектура клиент-серверного приложения.
- Реализованы CRUD операции для игр и вишлистов через API.
- Интеграция со Steam API (через `SteamService`).
- Фоновая задача (`PriceUpdater`) для обновления цен.
- Использование DTO для защиты от over-posting и контроля данных.
- Проект структурирован по слоям (контроллеры, сервисы, модели, DTO).

---

## Что можно было бы улучшить / What could be improved

| Русский | English |
|---------|---------|
| Добавить аутентификацию и авторизацию (JWT, Identity) | Add authentication & authorization (JWT, Identity) |
| Внедрить логирование (Serilog, ILogger) | Implement logging (Serilog, ILogger) |
| Добавить глобальную обработку ошибок и валидацию DTO | Add global error handling & DTO validation |
| Разделить `PriceUpdater` на фоновую службу с интервалом (IHostedService) | Separate `PriceUpdater` into a background service with interval (IHostedService) |
| Написать юнит-тесты и интеграционные тесты | Write unit & integration tests |
| Добавить кэширование (в памяти или Redis) для ответов Steam API | Add caching (in-memory or Redis) for Steam API responses |
| Использовать `HttpClientFactory` для SteamService | Use `HttpClientFactory` for SteamService |
| Развернуть через Docker + Docker Compose | Deploy via Docker + Docker Compose |
| Добавить CI/CD (GitHub Actions, GitLab CI) | Add CI/CD (GitHub Actions, GitLab CI) |
| Реализовать пагинацию, фильтрацию и поиск в API | Implement pagination, filtering & search in API |
| Переписать фронтенд на React/Vue для реактивности | Rewrite frontend with React/Vue for reactivity |
| Добавить SignalR для реального времени (уведомления о скидках) | Add SignalR for real-time (discount notifications) |
| Использовать Environment Variables для ключей API | Use Environment Variables for API keys |
| Добавить Swagger (OpenAPI) для документации | Add Swagger (OpenAPI) for documentation |

mini_app.sln                     # Решение Visual Studio
README.md                        # Описание проекта

MINI_APP/                        # Корень backend-приложения (ASP.NET Core)
├── app.csproj                   # Файл проекта
├── app.http                     # Тестовые HTTP-запросы
├── Program.cs                   # Точка входа и конфигурация приложения
├── appsettings.json             # Конфигурация (БД, ключи API)
├── appsettings.Development.json # Конфигурация для разработки
│
├── bin/                         # Скомпилированные бинарные файлы
│
├── obj/                         # Промежуточные файлы сборки
│
├── Properties/
│   └── launchSettings.json      # Настройки запуска (порты, профили)
│
├── Controllers/                 # Контроллеры API
│   ├── GamesController.cs       # CRUD для игр
│   └── WishlistController.cs    # Управление списком желаемого
│
├── Data/
│   └── AppDbContext.cs          # Контекст Entity Framework Core (БД)
│
├── models/                      # Модели / сущности БД
│   ├── game.cs                  # Игра
│   ├── WishList.cs              # Элемент вишлиста
│   └── SteamResponse.cs         # Ответ от Steam API (десериализация)
│
├── DTO/                         # Data Transfer Objects
│   ├── GameCreateDto.cs         # Данные для создания игры
│   ├── GameDto.cs               # Базовая инфа об игре
│   └── GameResponseDto.cs       # Расширенный ответ с ценой/скидкой
│
├── service/                     # Сервисы с бизнес-логикой
│   ├── GameService.cs           # Операции с играми
│   ├── SteamService.cs          # Интеграция со Steam API
│   └── PriceUpdater.cs          # Фоновое обновление цен
│
└── front/                       # Фронтенд (статический)
    ├── src/
    │   ├── api.js               # Клиентские запросы к API
    │   ├── app.html             # Главная HTML-страница
    │   └── main.js              # Логика UI
    └── style.css                # Стили


    Таблица с описанием каждого элемента
Путь	Тип	Назначение (русский)	Purpose (English)
mini_app.sln	Solution	Управление проектом в Visual Studio	Project management in Visual Studio
README.md	Документ	Описание, запуск, API	Description, setup, API
MINI_APP/Program.cs	Файл	Точка входа приложения (Host, Middleware, DI)	App entry point (Host, Middleware, DI)
appsettings.json	Конфиг	Настройки (строка БД, API ключи)	Settings (DB connection, API keys)
appsettings.Development.json	Конфиг	Переопределение для dev-среды	Override for dev environment
Controllers/	Папка	Обработка HTTP-запросов	Handles HTTP requests
GamesController.cs	Контроллер	CRUD для игр	CRUD for games
WishlistController.cs	Контроллер	Добавление/удаление из вишлиста	Add/remove wishlist items
Data/AppDbContext.cs	Контекст	Работа с БД через EF Core	DB operations via EF Core
models/	Папка	Сущности БД	DB entities
game.cs	Модель	Игра (Id, Name, Price, SteamId)	Game (Id, Name, Price, SteamId)
WishList.cs	Модель	Пользовательский вишлист	User wishlist
SteamResponse.cs	Модель	Десериализация ответа Steam	Steam response deserialization
DTO/	Папка	Обмен данными с клиентом	Data exchange with client
GameCreateDto.cs	DTO	Создание новой игры	Create new game
GameDto.cs	DTO	Базовая информация	Basic info
GameResponseDto.cs	DTO	Полные данные для клиента	Full data for client
service/	Папка	Бизнес-логика	Business logic
GameService.cs	Сервис	Манипуляции с играми (через репозиторий)	Game manipulations (via repository)
SteamService.cs	Сервис	Запросы к Steam API (цены, названия)	Steam API requests (prices, names)
PriceUpdater.cs	Сервис	Фоновое обновление цен из Steam	Background price update from Steam
front/	Папка	Статический фронтенд	Static frontend
src/api.js	JS	AJAX-запросы к ASP.NET API	AJAX calls to ASP.NET API
src/app.html	HTML	Интерфейс пользователя	User interface
src/main.js	JS	Логика интерфейса (рендер, события)	UI logic (render, events)
style.css	CSS	Визуальное оформление	Visual styling



Типовой поток данных

[app.html] → main.js → api.js → (HTTP) → GamesController  
→ GameService → AppDbContext → SQL DB  
← GameResponseDto ← json ← [браузер]


