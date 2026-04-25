using Microsoft.EntityFrameworkCore;

public class PriceUpdater : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public PriceUpdater(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var steam = scope.ServiceProvider.GetRequiredService<SteamService>();

            var games = await db.Games.ToListAsync();

            foreach (var game in games)
            {
                try
                {
                    var (oldPrice, newPrice, discount) =
                        await steam.GetPrice(game.AppId);

                    game.OldPrice = oldPrice;
                    game.NewPrice = newPrice;
                    game.Discount = discount;
                }
                catch
                {
                    // игнор ошибок Steam
                }
            }

            await db.SaveChangesAsync();

            await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
        }
    }
}