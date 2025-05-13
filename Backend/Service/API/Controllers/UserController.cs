using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Aplication.DTOs.User;
using Service.Aplication.Interfaces.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Service.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly IAuthService _authService;

        public UserController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        [Authorize]
        [HttpGet("info")]
        public async Task<IActionResult> GetUserInfo(CancellationToken ct)
        {
            var userId = Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

            var userInfo = await _userService.GetUserInfoAsync(userId, ct);

            if (userInfo == null)
                return NotFound();

            return Ok(userInfo);
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto, CancellationToken ct)
        {
            var userId = Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);
            await _userService.UpdateUserInfoAsync(userId, dto, ct);

            return NoContent();
        }

        [Authorize]
        [HttpGet("check-username/{username}")]
        public async Task<IActionResult> CheckUSername(string username, CancellationToken ct)
        {
           var isAvaiable = await _authService.IsUsernameAvailableAsync(username, ct);

            if (!isAvaiable)
                return BadRequest("Username already exists");

            return Ok();
        }

        [Authorize]
        [HttpGet("check-email/{email}")]
        public async Task<IActionResult> CheckEmail(string email, CancellationToken ct)
        {
            var isAvaiable = await _authService.IsEmailAvailableAsync(email, ct);

            if (!isAvaiable)
                return BadRequest("Email already exists");

            return Ok();
        }


    }
}
