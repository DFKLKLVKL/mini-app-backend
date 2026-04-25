using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("games")]
public class GamesController : ControllerBase
{
    private readonly AppDbContext _db;

    public GamesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetGames()
    {
        return Ok(await _db.Games.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> AddGame(Game game)
    {
        if (game.OldPrice > 0 && game.NewPrice > 0)
        {
            game.Discount = (int)Math.Round(
                (1 - (decimal)game.NewPrice / game.OldPrice) * 100
            );
        }

        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        return Ok(game);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        var game = await _db.Games.FindAsync(id);
        if (game == null) return NotFound();

        _db.Games.Remove(game);
        await _db.SaveChangesAsync();

        return Ok();
    }
}