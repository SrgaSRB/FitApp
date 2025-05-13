using Service.Aplication.DTOs.User;
using Service.Domain.Models;

namespace Service.Aplication.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<bool> UsernameExistAsync(string username, CancellationToken ct = default);
        Task<bool> EmailExistAsync(string email, CancellationToken ct = default);
        Task AddAsync(User user, CancellationToken ct = default);
        Task<User?> GetUserByUsernameAsync(string username, CancellationToken ct = default);
        Task<User?> GetUserByEmailAsync(string email, CancellationToken ct = default);
        Task<User?> GetUserByIdAsync(Guid id, CancellationToken ct = default);

        Task<User?> GetUserInfoAsync(Guid id, CancellationToken ct = default);
        Task<bool> UpdateUserInfoAsync(Guid id, UpdateUserDto userInfo, CancellationToken ct = default);
    }
}
