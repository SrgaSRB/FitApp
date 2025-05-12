using Service.Domain.Models;

namespace Service.Aplication.Interfaces.Repositories
{
    public interface IWorkoutRepository
    {
        Task<List<Workout>> GetAllByUserAsync(Guid userId, CancellationToken ct = default);
    }
}
