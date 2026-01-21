using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Claims;
using PhuLongDotNet.Services;

namespace PhuLongDotNet.Pages;

public class AdminModel : PageModel
{
    private readonly JsonDataService _dataService;

    public AdminModel(JsonDataService dataService)
    {
        _dataService = dataService;
    }

    public string? ErrorMessage { get; set; }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostLoginAsync(string username, string password)
    {
        var users = await _dataService.GetUsersAsync();
        var user = users.FirstOrDefault(u => u.Username == username && u.Password == password);

        if (user != null && !string.IsNullOrEmpty(user.Username))
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity));

            return RedirectToPage("/Admin");
        }

        ErrorMessage = "Invalid username or password";
        return Page();
    }

    public async Task<IActionResult> OnPostLogoutAsync()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToPage("/Admin");
    }
}
