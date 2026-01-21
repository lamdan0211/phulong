using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using PhuLongDotNet.Services;

namespace PhuLongDotNet.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly JsonDataService _jsonDataService;

    public Dictionary<string, object> ContentData { get; private set; } = new();

    public IndexModel(ILogger<IndexModel> logger, JsonDataService jsonDataService)
    {
        _logger = logger;
        _jsonDataService = jsonDataService;
    }

    public async Task OnGetAsync()
    {
        ContentData = await _jsonDataService.GetContentDataAsync();
    }
}
