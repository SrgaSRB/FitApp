using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Service.Aplication.DTOs.Auth;
using Service.Aplication.Interfaces.Services;
using Service.Domain.Enums;
using Service.Domain.Models;
using Service.Infrastructure.Data;

namespace Service.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
  

        [HttpGet("check-username/{username}")]
        public async Task<IActionResult> CheckUsername(string username, CancellationToken ct = default)
        {
            bool isAvailable = await _authService.IsUsernameAvailableAsync(username, ct);

            return isAvailable ? Ok() : Conflict();
        }

        [HttpGet("check-email/{email}")]
        public async Task<IActionResult> CheckEmail(string email, CancellationToken ct)
        {
            bool isAvailable = await _authService.IsEmailAvailableAsync(email, ct);

            return isAvailable ? Ok() : Conflict();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUserDto dto, CancellationToken ct = default)
        { 
            await _authService.RegisterUserAsync(dto, ct);

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken ct)
        {
            var token = await _authService.LoginUserAsync(dto, ct);

            return Ok(token);
        }


    }
}


