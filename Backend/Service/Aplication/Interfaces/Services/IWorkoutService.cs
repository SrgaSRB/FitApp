using Service.Aplication.DTOs.Workout;

namespace Service.Aplication.Interfaces.Services
{
    public interface IWorkoutService
    {
        Task<WorkoutSummaryDto> WorkoutSum(Guid userId, CancellationToken ct);
    }
}
