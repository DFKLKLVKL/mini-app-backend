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
    var url = $"https://store.steampowered.com/api/appdetails?appids={appId}&cc=ru&l=ru";

    var response = await _http.GetFromJsonAsync<Dictionary<string, SteamResponse>>(url);

    var result = response[appId.ToString()];

    if (result == null || !result.Success || result.Data?.PriceOverview == null)
        throw new Exception("Нет данных о цене");

    var price = result.Data.PriceOverview;

    return (
        price.Initial / 100m,
        price.Final / 100m,
        price.DiscountPercent
    );
}

    public async Task<(string name, string image)> GetGameInfo(int appId)
    {
        var url = $"https://store.steampowered.com/api/appdetails?appids={appId}";

        var response = await _http.GetFromJsonAsync<Dictionary<string, SteamResponse>>(url);

        var data = response[appId.ToString()].Data;

        return (data.Name, data.HeaderImage);
    }

}