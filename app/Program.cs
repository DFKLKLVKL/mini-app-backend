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