using Service.Aplication.DTOs.Workout;
using Service.Domain.Models;

namespace Service.Aplication.Interfaces.Repositories
{
    public interface IWorkoutRepository
    {
        Task<List<Workout>> GetAllByUserAsync(Guid userId, CancellationToken ct = default);
        Task<List<WorkoutDto>> GetLastXWorkoutsAsync(Guid userId, int x, CancellationToken ct = default);
        Task<List<WorkoutDto>> GetTodayWorkoutsAsync(Guid userId, CancellationToken ct = default);
        Task<bool> AddWorkoutAsync(Guid userId, CreateWorkoutDto dto, CancellationToken ct = default);
        Task<List<WeeklyStatistic>> GetWeeklyStatistics (Guid userId, ProgressDateDto dto, CancellationToken ct = default);
        Task<List<WorkoutHistoryDto>> GetAllWorkoutsAsync(Guid userId, CancellationToken ct = default);
        Task<bool> DeleteWorkoutAsync(Guid workoutId, CancellationToken ct = default);

    }
}
