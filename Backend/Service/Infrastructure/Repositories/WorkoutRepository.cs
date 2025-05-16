using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Service.Aplication.DTOs.Workout;
using Service.Aplication.Exceptions;
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

        private DateTime GetStartOfWeek(DateTime date)
        {
            int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.Date.AddDays(-diff);
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
                throw new NotFoundException($"User with ID {userId} not found.");
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

            var firstDayOfWeek = startDate.AddDays(-(int)startDate.DayOfWeek + 1);
            var lastDayOfWeek = endDate.AddDays(6 - (int)endDate.DayOfWeek + 1);

            var workouts = await _context.Workouts
                .Where(w => w.UserId == userId && w.StartTime >= firstDayOfWeek && w.StartTime <= lastDayOfWeek)
                .ToListAsync(ct);

            var statsByWeek = workouts
                .GroupBy(w => GetStartOfWeek(w.StartTime.UtcDateTime))
                .ToDictionary(
                    g => g.Key,
                    g => new
                    {
                        TotalTrainings = g.Count(),
                        TotalBurnedCalories = g.Sum(w => w.CaloriesBurned),
                        TotalTrainingTimeMinutes = g.Sum(w => w.DurationMinutes),
                        AvgIntensity = g.Average(w => w.Intensity),
                        AvgFatigue = g.Average(w => w.Fatigue)
                    });

            var weeks = Enumerable.Range(0, (int)((lastDayOfWeek - firstDayOfWeek).TotalDays / 7) + 1)
                .Select(i =>
                {
                    var start = firstDayOfWeek.AddDays(i * 7);
                    var end = start.AddDays(6);
                    return new { Start = start, End = end };
                })
                .ToList();

            var result = weeks.Select(w => new WeeklyStatistic
            {
                StartWeek = w.Start,
                EndWeek = w.End,
                TotalTrainings = statsByWeek.TryGetValue(w.Start, out var s) ? s.TotalTrainings : 0,
                TotalBurnedCalories = statsByWeek.TryGetValue(w.Start, out s) ? s.TotalBurnedCalories : 0,
                TotalTrainingTimeMinutes = statsByWeek.TryGetValue(w.Start, out s) ? s.TotalTrainingTimeMinutes : 0,
                AverageTrainingIntensity = statsByWeek.TryGetValue(w.Start, out s) ? s.AvgIntensity : 0,
                AverageTrainingFatigue = statsByWeek.TryGetValue(w.Start, out s) ? s.AvgFatigue : 0
            }).ToList();

            return result;
        }

        public async Task<List<WorkoutHistoryDto>> GetAllWorkoutsAsync(Guid userId, CancellationToken ct = default)
        {
            var workoutList = await _context.Workouts
                .Where(w => w.UserId == userId)
                .Select(w => new WorkoutHistoryDto
                {
                    Id = w.Id,
                    CaloriesBurned = w.CaloriesBurned,
                    DurationMinutes = w.DurationMinutes,
                    Fatigue = w.Fatigue,
                    Intensity = w.Intensity,
                    Note = w.Note,
                    StartTime = w.StartTime.UtcDateTime,
                    Type = w.Type
                }).ToListAsync();

            return workoutList;
        }

        public async Task<bool> DeleteWorkoutAsync(Guid workoutId, CancellationToken ct = default)
        {
            var workout = await _context.Workouts
                .FirstOrDefaultAsync(w => w.Id == workoutId);

            if (workout == null)
            {
                throw new NotFoundException($"Workout with ID {workoutId} not found.");
            }

            _context.Workouts.Remove(workout);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
