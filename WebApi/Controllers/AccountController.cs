using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTOs;
using WebApi.Services;
using System.Security.Claims;

namespace WebApi.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase {
    private readonly UserManager<AppUser> userManager;
    private readonly TokenService tokenService;

    public AccountController(UserManager<AppUser> userManager, TokenService tokenService){
        this.userManager = userManager;
        this.tokenService = tokenService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){
        var user = await userManager.Users.Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

        if (user == null) return Unauthorized();

        var result = await userManager.CheckPasswordAsync(user, loginDto.Password);
        if (result){
           await SetRefreshToken(user!);
           return CreateUserObject(user);
        }

        return Unauthorized();
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto){
        if (await userManager.Users.AnyAsync(x => x.UserName == registerDto.Username)){
            ModelState.AddModelError("username", "username already taken");
            return ValidationProblem();
        }

         if (await userManager.Users.AnyAsync(x => x.Email == registerDto.Email)){
            ModelState.AddModelError("email", "Email already taken");
            return ValidationProblem();
        }
        var user = new AppUser{
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Username
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (result.Succeeded){
            await SetRefreshToken(user!);
            return CreateUserObject(user);
        }
        return BadRequest(result.Errors);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser(){
        var user = await userManager.Users.Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
        await SetRefreshToken(user!);
        return CreateUserObject(user!);
    }

    [HttpPost("refreshToken")]
    public async Task<ActionResult<UserDto>> RefreshToken(){

         var refreshToken = Request.Cookies["refreshToken"];

        var user = await userManager.Users
            .Include(r => r.RefreshTokens)
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

        if (user == null) return Unauthorized();

        var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

        if (oldToken != null && !oldToken.IsActive) return Unauthorized();

        if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

        return CreateUserObject(user!);
    }

    private async Task SetRefreshToken(AppUser user)
    {
            var refreshToken = tokenService.GenerateRefreshToken();

            user.RefreshTokens.Add(refreshToken);
            await userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token!, cookieOptions);
    }

    private ActionResult<UserDto> CreateUserObject(AppUser user){
        return new UserDto
        {
            DisplayName = user.DisplayName,
            Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
            Token = tokenService.CreateToken(user!),
            Username = user?.UserName
        };
    }
}