using Microsoft.AspNetCore.Mvc;
using PhuLongDotNet.Services;

namespace PhuLongDotNet.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DataController : ControllerBase
{
    private readonly JsonDataService _dataService;

    public DataController(JsonDataService dataService)
    {
        _dataService = dataService;
    }

    [HttpGet("content")]
    public async Task<IActionResult> GetContent()
    {
        var data = await _dataService.GetContentDataAsync();
        return Ok(data);
    }

    [HttpPost("content")]
    public async Task<IActionResult> SaveContent([FromBody] Dictionary<string, object> data)
    {
        await _dataService.SaveContentDataAsync(data);
        return Ok();
    }

    [HttpGet("images")]
    public async Task<IActionResult> GetImages()
    {
        var data = await _dataService.GetImagesDataAsync();
        return Ok(data);
    }

    [HttpPost("images")]
    public async Task<IActionResult> SaveImages([FromBody] Dictionary<string, object> data)
    {
        await _dataService.SaveImagesDataAsync(data);
        return Ok();
    }

    [HttpGet("popups")]
    public async Task<IActionResult> GetPopups()
    {
        var data = await _dataService.GetPopupsDataAsync();
        return Ok(data);
    }

    [HttpPost("popups")]
    public async Task<IActionResult> SavePopups([FromBody] Dictionary<string, object> data)
    {
        await _dataService.SavePopupsDataAsync(data);
        return Ok();
    }
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var data = await _dataService.GetUsersAsync();
        return Ok(data);
    }

    [HttpPost("users")]
    public async Task<IActionResult> SaveUsers([FromBody] List<User> data)
    {
        await _dataService.SaveUsersAsync(data);
        return Ok();
    }
    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { url = "/uploads/" + uniqueFileName });
    }
}
