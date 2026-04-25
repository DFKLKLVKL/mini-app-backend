using Microsoft.EntityFrameworkCore;
using mini_app.DTO;

public class GameService
{
    private readonly AppDbContext _db;

    public GameService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Game>> GetAll()
    {
        return await _db.Games.ToListAsync();
    }

    public async Task<Game> Add(CreateGameDto dto)
    {
        var game = new Game
        {
            AppId = dto.AppId,
            Name = dto.Name,
            ImageUrl = dto.ImageUrl ?? "https://placehold.co/400x200",
            OldPrice = dto.OldPrice,
            NewPrice = dto.NewPrice,
            Discount = dto.OldPrice > 0
                ? (int)Math.Round((1 - dto.NewPrice / dto.OldPrice) * 100)
                : 0
        };

        _db.Games.Add(game);
        await _db.SaveChangesAsync();

        return game;
    }

    public async Task<bool> Delete(int id)
    {
        var game = await _db.Games.FindAsync(id);
        if (game == null) return false;

        _db.Games.Remove(game);
        await _db.SaveChangesAsync();

        return true;
    }
}