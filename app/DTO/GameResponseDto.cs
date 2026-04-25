public class GameResponseDto
{
    public int Id { get; set; }
    public int AppId { get; set; }
    public string Name { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public decimal OldPrice { get; set; }
    public decimal NewPrice { get; set; }
    public int Discount { get; set; }
}