using Service.Aplication.DTOs.Workout;
using Service.Aplication.Interfaces.Repositories;
using Service.Aplication.Interfaces.Services;

namespace Service.Aplication.Services.Workout
{
    public class WorkoutService : IWorkoutService
    {
        private readonly IWorkoutRepository _workouts;

        public WorkoutService(IWorkoutRepository workouts)
        {
            _workouts = workouts;
        }

        public async Task<WorkoutSummaryDto> WorkoutSum(Guid userId, CancellationToken ct)
        {

            var workoutList = await _workouts.GetAllByUserAsync(userId);

            if (workoutList.Count == 0)
                return new WorkoutSummaryDto();

            return new WorkoutSummaryDto
            {
                TotalTrainings = workoutList.Count,
                TotalBurnedCalories = workoutList.Sum(w => w.CaloriesBurned),
                TotalTrainingTimeMinutes = workoutList.Sum(w => w.DurationMinutes),
                AverageTrainingFatigue = workoutList.Average(w => w.Fatigue),
                AverageTrainingIntensity = workoutList.Average(w => w.Intensity)
            };

        }

        public Task<List<WorkoutDto>> GetLastXWorkouts(Guid userId, int x, CancellationToken ct)
        {
            return _workouts.GetLastXWorkoutsAsync(userId, x, ct);
        }

        public Task<List<WorkoutDto>> GetTodayWorkoutsAsync(Guid userId, CancellationToken ct = default)
        {
            return _workouts.GetTodayWorkoutsAsync(userId, ct);
        }

        public async Task<bool> AddWorkoutAsyncs(Guid userId, CreateWorkoutDto dto, CancellationToken ct)
        {
            return await _workouts.AddWorkoutAsync(userId, dto, ct);
        }

        public Task<List<WeeklyStatistic>> GetWeeklyStatistics(Guid userId, ProgressDateDto dto, CancellationToken ct = default)
        {
            return _workouts.GetWeeklyStatistics(userId, dto, ct);
        }

        public async Task<List<WorkoutHistoryDto>> GetAllWorkoutsAsync(Guid userId, CancellationToken ct = default)
        {
            return await _workouts.GetAllWorkoutsAsync(userId, ct);
        }

        public async Task<bool> DeleteWorkoutAsync(Guid workoutId, CancellationToken ct = default)
        {
            return await _workouts.DeleteWorkoutAsync(workoutId, ct);
        }
    }
}
