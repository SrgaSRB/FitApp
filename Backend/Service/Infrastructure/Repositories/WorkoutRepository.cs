using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Service.Aplication.DTOs.Workout;
using Service.Aplication.Interfaces.Repositories;
using Service.Domain.Models;
using Service.Infrastructure.Data;

namespace Service.Infrastructure.Repositories
{
    public class WorkoutRepository : IWorkoutRepository
    {
        private readonly AppDbContext _context;

        public WorkoutRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<List<Workout>> GetAllByUserAsync(Guid userId, CancellationToken ct = default)
        {
            var workoutList = await _context.Workouts
                .Where(w => w.UserId == userId)
                .ToListAsync();

            return workoutList;
        }

        public async Task<List<WorkoutDto>> GetLastXWorkoutsAsync(Guid userId, int x, CancellationToken ct = default)
        {
            var workoutList = await _context.Workouts
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.StartTime)
                .Take(x)
                .Select(w => new WorkoutDto
                {
                    Id = w.Id,
                    Type = w.Type,
                    StartTime = w.StartTime.ToUniversalTime(),
                    CaloriesBurned = w.CaloriesBurned,
                    DurationMinutes = w.DurationMinutes,
                    Fatigue = w.Fatigue,
                    Intensity = w.Intensity,
                    Note = w.Note
                })
                .ToListAsync(ct);

            return workoutList;

        }

        public async Task<List<WorkoutDto>> GetTodayWorkoutsAsync(Guid userId, CancellationToken ct = default)
        {
            var today = DateTimeOffset.UtcNow.Date;

            var workoutList = await _context.Workouts
                .Where(w => w.UserId == userId && w.StartTime.Date == today)
                .OrderByDescending(w => w.StartTime)
                .Select(w => new WorkoutDto
                {
                    Id = w.Id,
                    Type = w.Type,
                    StartTime = w.StartTime.ToUniversalTime(),
                    CaloriesBurned = w.CaloriesBurned,
                    DurationMinutes = w.DurationMinutes,
                    Fatigue = w.Fatigue,
                    Intensity = w.Intensity,
                    Note = w.Note
                })
                .ToListAsync(ct);

            return workoutList;
        }

        public async Task<bool> AddWorkoutAsync(Guid userId, CreateWorkoutDto dto, CancellationToken ct = default)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId, ct);

            if (user == null)
            {
                return false;
            }

            var workout = new Workout
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = dto.Type,
                StartTime = dto.StartTime.ToUniversalTime(),
                CaloriesBurned = dto.CaloriesBurned,
                DurationMinutes = dto.DurationMinutes,
                Fatigue = dto.Fatigue,
                Intensity = dto.Intensity,
                Note = dto.Note
            };

            _context.Workouts.Add(workout);

            await _context.SaveChangesAsync(ct);

            return true;
        }

        public async Task<List<WeeklyStatistic>> GetWeeklyStatistics(Guid userId, ProgressDateDto dto, CancellationToken ct = default)
        {
            var startDate = new DateTime(int.Parse(dto.Year), int.Parse(dto.Month), 1, 0, 0, 0, DateTimeKind.Utc);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var firstDayOfWeek = startDate.AddDays(-(int)startDate.DayOfWeek);
            var lastDayOfWeek = endDate.AddDays(6 - (int)endDate.DayOfWeek);

            var weeks = Enumerable.Range(0, (int)((lastDayOfWeek - firstDayOfWeek).TotalDays / 7) + 1)
                .Select(i => new
                {
                    Index = i,
                    Start = firstDayOfWeek.AddDays(i * 7),
                    End = firstDayOfWeek.AddDays(i * 7 + 6)
                })
                .ToList();

            var statsByWeek = await _context.Workouts
                .Where(w => w.UserId == userId && w.StartTime >= firstDayOfWeek && w.StartTime <= lastDayOfWeek)
                .GroupBy(w => (int)((w.StartTime - firstDayOfWeek).TotalDays / 7))
                .ToDictionaryAsync(g => g.Key, g => new
                {
                    TotalTrainings = g.Count(),
                    TotalBurnedCalories = g.Sum(w => w.CaloriesBurned),
                    TotalTrainingTimeMinutes = g.Sum(w => w.DurationMinutes),
                    AvgIntensity = g.Average(w => w.Intensity),
                    AvgFatigue = g.Average(w => w.Fatigue)
                }, ct);

            var result = weeks.Select(w => new WeeklyStatistic
            {
                StartWeek = w.Start,
                EndWeek = w.End,
                TotalTrainings = statsByWeek.TryGetValue(w.Index, out var s) ? s.TotalTrainings : 0,
                TotalBurnedCalories = statsByWeek.TryGetValue(w.Index, out s) ? s.TotalBurnedCalories : 0,
                TotalTrainingTimeMinutes = statsByWeek.TryGetValue(w.Index, out s) ? s.TotalTrainingTimeMinutes : 0,
                AverageTrainingIntensity = statsByWeek.TryGetValue(w.Index, out s) ? s.AvgIntensity : 0,
                AverageTrainingFatigue = statsByWeek.TryGetValue(w.Index, out s) ? s.AvgFatigue : 0
            }).ToList();

            return result;
        }

    }
}
