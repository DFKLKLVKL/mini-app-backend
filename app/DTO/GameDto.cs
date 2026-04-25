namespace mini_app.DTO;

public record GameDto(
    int Id,
    int AppId,
    string Name,
    string ImageUrl,
    decimal OldPrice,
    decimal NewPrice,
    int Discount
);