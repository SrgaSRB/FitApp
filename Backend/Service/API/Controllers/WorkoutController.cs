using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Aplication.DTOs.Workout;
using Service.Aplication.Interfaces.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Service.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkoutController : ControllerBase
    {
        private readonly IWorkoutService _workout;

        public WorkoutController(IWorkoutService service)
        {
            _workout = service;
        }

        [Authorize]
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(CancellationToken ct)
        {
            Guid userId = Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);
            var dto = await _workout.WorkoutSum(userId, ct);

            return Ok(dto); ;
        }

        [Authorize]
        [HttpGet("last-3")]
        public async Task<IActionResult> GetLastNWorkouts(CancellationToken ct)
        {
            Guid userId = Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

            var workouts = await _workout.GetLastXWorkouts(userId, 3, ct);

            return Ok(workouts);

        }

        [Authorize]
        [HttpGet("today")]
        public async Task<IActionResult> GetTodayWorkouts(CancellationToken ct)
        {
            Guid userId = Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

            var workouts = await _workout.GetTodayWorkoutsAsync(userId, ct);

            return Ok(workouts);

        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddWorkout([FromBody] CreateWorkoutDto dto, CancellationToken ct)
        {
            Guid userId = Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

            var result = await _workout.AddWorkoutAsyncs(userId, dto, ct);

            if (result)
                return Ok();
            else
                return BadRequest("Error adding workout");
        }

        [Authorize]
        [HttpPost("weekly-statistics")]
        public async Task<IActionResult> GetWeeklyStatistic([FromBody] ProgressDateDto dto, CancellationToken ct)
        {
            Guid userId = Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

            var result = await _workout.GetWeeklyStatistics(userId, dto, ct);

            if (result == null)
                return NotFound();

            return Ok(result);
        }


    }
}
