using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);



// PORT (Render / локально)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=games.db"));

builder.Services.AddCors(Options =>
{
    Options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();


app.MapGet("/games", async (AppDbContext db)=>
{
    return await db.Games.ToListAsync();
});


// создать БД при старте
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

/* =========================
   WISHLIST
========================= */
app.MapGet("/wishlist/{userId}", async (string userId, AppDbContext db) =>
{
    return await db.WishList
        .Where(w => w.UserId == userId)
        .ToListAsync();
});

/* =========================
   ADD GAME
========================= */
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

/* =========================
   DELETE GAME
========================= */
app.MapDelete("/games/{id}", async (int id, AppDbContext db) =>
{
    var game = await db.Games.FindAsync(id);
    if (game == null) return Results.NotFound();

    db.Games.Remove(game);
    await db.SaveChangesAsync();

    return Results.Ok();
});

app.Run();
