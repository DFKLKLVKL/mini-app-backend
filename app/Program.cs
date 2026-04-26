using Microsoft.EntityFrameworkCore;
using mini_app.DTO;

var builder = WebApplication.CreateBuilder(args);

// =========================
// PORT (Railway)
// =========================
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// =========================
// DB
// =========================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=games.db"));

// =========================
// SERVICES
// =========================
builder.Services.AddHttpClient<SteamService>();
builder.Services.AddScoped<GameService>();
builder.Services.AddHostedService<PriceUpdater>();

// =========================
// CORS
// =========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAll");

// =========================
// DB INIT
// =========================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// =========================
// GAMES
// =========================

// GET ALL
app.MapGet("/games", async (GameService service) =>
{
    var games = await service.GetAll();

    return Results.Ok(games.Select(g => new GameDto(
        g.Id,
        g.AppId,
        g.Name,
        g.ImageUrl,
        g.OldPrice,
        g.NewPrice,
        g.Discount
    )));
});

// CREATE
app.MapPost("/games", async (CreateGameDto dto, GameService service) =>
{
    try
    {
        var game = await service.Add(dto);
        return Results.Created($"/games/{game.Id}", game);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(ex.Message);
    }
});

// DELETE
app.MapDelete("/games/{id}", async (int id, GameService service) =>
{
    var ok = await service.Delete(id);
    return ok ? Results.Ok() : Results.NotFound();
});

// =========================
// STEAM UPDATE
// =========================
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

// =========================
// WISHLIST
// =========================
app.MapGet("/wishlist/{userId}", async (string userId, AppDbContext db) =>
{
    return await db.WishList
        .Where(w => w.UserId == userId)
        .ToListAsync();
});

app.MapPost("/wishlist", async (WishListItem item, AppDbContext db) =>
{
    db.WishList.Add(item);
    await db.SaveChangesAsync();
    return Results.Ok(item);
});

app.MapDelete("/wishlist/{userId}/{gameId}", async (string userId, int gameId, AppDbContext db) =>
{
    var item = await db.WishList
        .FirstOrDefaultAsync(w => w.UserId == userId && w.gameId == gameId);

    if (item == null) return Results.NotFound();

    db.WishList.Remove(item);
    await db.SaveChangesAsync();

    return Results.Ok();
});

app.Run();