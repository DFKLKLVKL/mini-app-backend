namespace mini_app.DTO;

public record CreateGameDto(
    int AppId,
    string Name,
    string? ImageUrl,
    decimal OldPrice,
    decimal NewPrice
);