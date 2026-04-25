public class SteamResponse
{
    public SteamData Data { get; set; }
}

public class SteamData
{
    public SteamPrice PriceOverview { get; set; }
}

public class SteamPrice
{
    public decimal Initial { get; set; }
    public decimal Final { get; set; }
    public int DiscountPercent { get; set; }
}