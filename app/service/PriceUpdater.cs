using Microsoft.EntityFrameworkCore;

public class PriceUpdater : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<PriceUpdater> _logger;

    public PriceUpdater(IServiceScopeFactory scopeFactory, ILogger<PriceUpdater> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🔥 PriceUpdater started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();

                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var steam = scope.ServiceProvider.GetRequiredService<SteamService>();

                var games = await db.Games.ToListAsync(stoppingToken);

                _logger.LogInformation($"📦 Найдено игр: {games.Count}");

                int updated = 0;

                foreach (var game in games)
                {
                    try
                    {
                        var (oldPrice, newPrice, discount) =
                            await steam.GetPrice(game.AppId);

                        // обновляем только если есть изменения
                        if (game.NewPrice != newPrice || game.Discount != discount)
                        {
                            game.OldPrice = oldPrice;
                            game.NewPrice = newPrice;
                            game.Discount = discount;
                            updated++;
                        }

                        // защита от блокировки Steam
                        await Task.Delay(1000, stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"⚠️ Ошибка Steam для AppId {game.AppId}: {ex.Message}");
                    }
                }

                if (updated > 0)
                {
                    await db.SaveChangesAsync(stoppingToken);
                }

                _logger.LogInformation($"✅ Обновлено игр: {updated}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Критическая ошибка PriceUpdater: {ex.Message}");
            }

            _logger.LogInformation("⏳ Ждем 30 минут...");
            await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
        }
    }
}