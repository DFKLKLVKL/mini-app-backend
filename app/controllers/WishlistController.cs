using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("wishlist")]
public class WishlistController : ControllerBase
{
    private readonly AppDbContext _db;

    public WishlistController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(string userId)
    {
        return Ok(await _db.WishList
            .Where(w => w.UserId == userId)
            .ToListAsync());
    }
}