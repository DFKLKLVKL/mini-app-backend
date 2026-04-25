# mini-app-backend
mini_app/                      # Корень решения (sln)
│
├── app/                        # Основной бэкенд-проект (ASP.NET Core Web API)
│   ├── bin\Debug\net10.0/     # Папка сборки (бинарные файлы)
│   │
│   ├── Data/                   # Слой доступа к данным / контекст БД
│   │   ├── a.txt               # (Вероятно, вспомогательный текстовый файл)
│   │   └── AppDbContext.cs     # Контекст Entity Framework Core
│   │
│   ├── models/                 # Модели данных (Domain/Entities)
│   │   ├── b.txt               # (Вероятно, вспомогательный файл)
│   │   ├── game.cs             # Модель игры
│   │   ├── SteamResponse.cs    # Модель ответа от Steam API
│   │   └── WishList.cs         # Модель списка желаемого (Wishlist)
│   │
│   ├── obj/                    # Промежуточные файлы сборки
│   │
│   ├── Properties/             # Настройки запуска проекта
│   │   └── launchSettings.json # Конфигурация профилей запуска (Kestrel, IIS)
│   │
│   ├── service/                # Бизнес-логика / сервисы
│   │   ├── PriceUpdater.cs     # Сервис обновления цен
│   │   └── SteamService.cs     # Сервис для работы с API Steam
│   │
│   ├── app.csproj              # Файл проекта (NuGet-пакеты, зависимости)
│   ├── app.http                # Файл для тестирования HTTP-запросов (в IDE)
│   ├── appsettings.Development.json  # Конфигурация для режима разработки
│   ├── appsettings.json        # Основной файл конфигурации (строки подключения и пр.)
│   └── Program.cs              # Точка входа в приложение (HostBuilder)
│
├── front/                      # Фронтенд-часть (статический клиент)
│   ├── app.html                # Главная страница
│   ├── main.js                 # Основная клиентская логика
│   ├── style.css               # Стили страницы
│   └── src
│       └── api.js              # Модуль для взаимодействия с бэкендом (fetch/AJAX)
│
├── mini_app.sln                # Файл решения Visual Studio / .NET
└── README.md                   # Описание проекта