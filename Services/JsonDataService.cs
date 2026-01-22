using System.Text.Json;

namespace PhuLongDotNet.Services;

public class JsonDataService
{
    private readonly IWebHostEnvironment _env;

    public JsonDataService(IWebHostEnvironment env)
    {
        _env = env;
    }

    private string GetDataPath(string fileName)
    {
        return Path.Combine(_env.ContentRootPath, "Data", fileName);
    }

    public async Task<T> ReadJsonAsync<T>(string fileName)
    {
        var path = GetDataPath(fileName);
        if (!File.Exists(path))
        {
            return default!;
        }

        var json = await File.ReadAllTextAsync(path);
        return JsonSerializer.Deserialize<T>(json)!;
    }

    public async Task WriteJsonAsync<T>(string fileName, T data)
    {
        var path = GetDataPath(fileName);
        var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(path, json);
    }

    public async Task<Dictionary<string, object>> GetContentDataAsync()
    {
        return await ReadJsonAsync<Dictionary<string, object>>("content.json") ?? new Dictionary<string, object>();
    }

    public async Task SaveContentDataAsync(Dictionary<string, object> data)
    {
        await WriteJsonAsync("content.json", data);
    }

    public async Task<Dictionary<string, object>> GetImagesDataAsync()
    {
        return await ReadJsonAsync<Dictionary<string, object>>("images.json") ?? new Dictionary<string, object>();
    }

    public async Task SaveImagesDataAsync(Dictionary<string, object> data)
    {
        await WriteJsonAsync("images.json", data);
    }

    public async Task<Dictionary<string, object>> GetPopupsDataAsync()
    {
        return await ReadJsonAsync<Dictionary<string, object>>("popups.json") ?? new Dictionary<string, object>();
    }

    public async Task SavePopupsDataAsync(Dictionary<string, object> data)
    {
        await WriteJsonAsync("popups.json", data);
    }

    public async Task<List<User>> GetUsersAsync()
    {
        return await ReadJsonAsync<List<User>>("users.json") ?? new List<User>();
    }

    public async Task SaveUsersAsync(List<User> users)
    {
        await WriteJsonAsync("users.json", users);
    }
}

public class User
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
