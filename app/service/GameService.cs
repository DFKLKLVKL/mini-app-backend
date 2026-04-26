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

    public async Task<Game> Add(CreateGameDto dto, SteamService steam)
    {
        var (name, image) = await steam.GetGameInfo(dto.AppId);
        var (oldPrice, newPrice, discount) = await steam.GetPrice(dto.AppId);

        var game = new Game
        {
            AppId = dto.AppId,
            Name = name,
            ImageUrl = image,
            OldPrice = oldPrice,
            NewPrice = newPrice,
            Discount = discount
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