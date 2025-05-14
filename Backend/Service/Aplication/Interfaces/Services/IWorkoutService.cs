using Service.Aplication.DTOs.Workout;

namespace Service.Aplication.Interfaces.Services
{
    public interface IWorkoutService
    {
        Task<WorkoutSummaryDto> WorkoutSum(Guid userId, CancellationToken ct =default);
        Task<List<WorkoutDto>> GetLastXWorkouts(Guid userId, int x, CancellationToken ct = default);
        Task<List<WorkoutDto>> GetTodayWorkoutsAsync(Guid userId, CancellationToken ct = default);
        Task<bool> AddWorkoutAsyncs(Guid userId, CreateWorkoutDto dto, CancellationToken ct = default);
        Task<List<WeeklyStatistic>> GetWeeklyStatistics(Guid userId, ProgressDateDto dto, CancellationToken ct = default);
        Task<List<WorkoutHistoryDto>> GetAllWorkoutsAsync(Guid userId, CancellationToken ct = default);
        Task<bool> DeleteWorkoutAsync(Guid workoutId, CancellationToken ct = default);
    }
}
