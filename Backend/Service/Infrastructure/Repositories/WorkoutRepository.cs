using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
    }
}
