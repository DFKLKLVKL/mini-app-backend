using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

//
// =========================
// PORT (ВАЖНО ДЛЯ RAILWAY)
// =========================
//
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");  

//
// =========================
// DB (SQLite)
// =========================
//
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=games.db"));


builder.Services.AddHttpClient<SteamService>();

//
// =========================
// CORS (для фронта)
// =========================
//
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAll");

//
// =========================
// CREATE DB ON START
// =========================
//
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

//
// =========================
// GET GAMES
// =========================
app.MapGet("/games", async (AppDbContext db) =>
{
    return await db.Games.ToListAsync();
});

//
// =========================
// ADD GAME
// =========================
app.MapPost("/games", async (Game game, AppDbContext db) =>
{
    if (game.OldPrice > 0 && game.NewPrice > 0)
    {
        game.Discount = (int)Math.Round(
            (1 - (decimal)game.NewPrice / game.OldPrice) * 100
        );
    }

    db.Games.Add(game);
    await db.SaveChangesAsync();

    return Results.Created($"/games/{game.Id}", game);
});


app.MapPost("/games/{id}/update", async (int id, AppDbContext db, SteamService steam) =>
{
    var game = await db.Games.FindAsync(id);
    if (game == null) return Results.NotFound();

    var (oldPrice, newPrice, discount) = await steam.GetPrice(game.AppId);

    game.OldPrice = oldPrice;
    game.NewPrice = newPrice;
    game.Discount = discount;

    await db.SaveChangesAsync();

    return Results.Ok(game);
});



builder.Services.AddHostedService<PriceUpdater>();

//
// =========================
// DELETE GAME
// =========================
app.MapDelete("/games/{id}", async (int id, AppDbContext db) =>
{
    var game = await db.Games.FindAsync(id);
    if (game == null) return Results.NotFound();

    db.Games.Remove(game);
    await db.SaveChangesAsync();

    return Results.Ok();
});

//
// =========================
// GET WISHLIST
// =========================
app.MapGet("/wishlist/{userId}", async (string userId, AppDbContext db) =>
{
    return await db.WishList
        .Where(w => w.UserId == userId)
        .ToListAsync();
});

app.Run();

//
// =========================
// ADD TO WISHLIST
// =========================
app.MapPost("/wishlist", async (WishListItem item, AppDbContext db) =>
{
    db.WishList.Add(item);
    await db.SaveChangesAsync();
    return Results.Ok(item);
});

//
// =========================
// REMOVE FROM WISHLIST
// =========================
app.MapDelete("/wishlist/{userId}/{gameId}", async (string userId, int gameId, AppDbContext db) =>
{
    var item = await db.WishList
        .FirstOrDefaultAsync(w => w.UserId == userId && w.gameId == gameId);

    if (item == null) return Results.NotFound();

    db.WishList.Remove(item);
    await db.SaveChangesAsync();

    return Results.Ok();
});


