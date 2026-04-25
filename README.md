mini_app/
│
├── mini_app.sln              # Решение Visual Studio
├── README.md                 # Документация проекта
│
├── app/                      # Папка приложения (вероятно, собранный клиентский код)
│   └── bin/                  # Бинарные файлы приложения
│
├── front/                    # Фронтенд часть проекта
│   ├── src/
│   │   ├── api.js            # API запросы к бэкенду
│   │   └── app.html          # Основной HTML (или фрагмент)
│   ├── main.js               # Точка входа фронтенда
│   └── style.css             # Стили
│
├── Properties/               # Свойства проекта (launchSettings.json и т.п.)
│
├── controllers/              # Контроллеры ASP.NET Core (REST API)
│   ├── GamesController.cs    # Управление играми
│   └── WishlistController.cs # Управление списком желаний
│
├── Data/                     # Работа с базой данных
│   └── AppDbContext.cs       # Контекст Entity Framework Core
│
├── DTO/                      # Data Transfer Objects
│   ├── GameCreateDto.cs      # Данные для создания игры
│   ├── GameDto.cs            # Базовая информация об игре
│   └── GameResponseDto.cs    # Ответ с данными игры
│
├── models/                   # Модели базы данных
│   ├── Game.cs               # Модель игры
│   ├── SteamResponse.cs      # Ответ от Steam API
│   └── WishList.cs           # Модель списка желаний
│
├── service/                  # Бизнес-логика и сервисы
│   ├── GameService.cs        # Логика управления играми
│   ├── PriceUpdater.cs       # Обновление цен (фоновый сервис)
│   └── SteamService.cs       # Интеграция с Steam API
│
├── obj/                      # Объектные файлы (автогенерация)
│
├── app.csproj                # Файл проекта .NET
├── app.http                  # Тестовые HTTP-запросы
├── Program.cs                # Точка входа ASP.NET Core
│
├── appsettings.json          # Конфигурация приложения
└── appsettings.Development.json # Конфигурация для разработки