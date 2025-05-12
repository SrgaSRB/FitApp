using Microsoft.EntityFrameworkCore;
using Service.Aplication.Interfaces.Repositories;
using Service.Domain.Models;
using Service.Infrastructure.Data;

namespace Service.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<bool> UsernameExistAsync(string username, CancellationToken ct = default)
        {
            return _context.Users.AnyAsync(x => x.Username == username, ct);
        }

        public Task<bool> EmailExistAsync(string email, CancellationToken ct = default)
        {
            return _context.Users.AnyAsync(x => x.Email == email, ct);
        }

        public async Task AddAsync(User user, CancellationToken ct = default)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<User?> GetUserByUsernameAsync(string username, CancellationToken ct = default)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username, ct);

            return user;
        }

        public async Task<User?> GetUserByEmailAsync(string email, CancellationToken ct = default)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email, ct);

            return user;
        }

        public async Task<User?> GetUserByIdAsync(Guid id, CancellationToken ct = default)
        {
            var user = await _context.Users
                .Include(u => u.Workouts)
                .FirstOrDefaultAsync(u => u.Id == id, ct);

            return user;
        }
    }

}
