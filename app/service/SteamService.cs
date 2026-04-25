using System.Net.Http.Json;

public class SteamService
{
    private readonly HttpClient _http;

    public SteamService(HttpClient http)
    {
        _http = http;
    }

    public async Task<(decimal oldPrice, decimal newPrice, int discount)> GetPrice(int appId)
    {
        var url = $"https://store.steampowered.com/api/appdetails?appids={appId}&cc=ru";

        var res = await _http.GetFromJsonAsync<Dictionary<string, SteamResponse>>(url);

        var data = res?[appId.ToString()]?.Data?.PriceOverview;

        if (data == null)
            return (0, 0, 0);

        return (
            data.Initial / 100m,
            data.Final / 100m,
            data.DiscountPercent
        );
    }
}