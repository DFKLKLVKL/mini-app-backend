using Microsoft.EntityFrameworkCore;

public class GameService
{
    private readonly AppDbContext _db;

    public GameService(AppDbContext db)
    {
        _db = db;
    }

    // GET ALL
    public async Task<List<Game>> GetAll()
    {
        return await _db.Games.ToListAsync();
    }

    // ADD GAME
    public async Task<Game> Add(Game game)
    {
        // расчет скидки
        if (game.OldPrice > 0 && game.NewPrice > 0)
        {
            game.Discount = (int)Math.Round(
                (1 - (decimal)game.NewPrice / game.OldPrice) * 100
            );
        }

        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        return game;
    }

    // DELETE GAME
    public async Task<bool> Delete(int id)
    {
        var game = await _db.Games.FindAsync(id);
        if (game == null) return false;

        _db.Games.Remove(game);
        await _db.SaveChangesAsync();

        return true;
    }
}