using System.Text.Json.Serialization;
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

public class SteamResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("data")]
    public SteamGameData Data { get; set; }
}

public class SteamGameData
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("header_image")]
    public string HeaderImage { get; set; }

    [JsonPropertyName("price_overview")]
    public PriceOverview PriceOverview { get; set; }
}

public class PriceOverview
{
    [JsonPropertyName("initial")]
    public int Initial { get; set; }

    [JsonPropertyName("final")]
    public int Final { get; set; }

    [JsonPropertyName("discount_percent")]
    public int DiscountPercent { get; set; }
}