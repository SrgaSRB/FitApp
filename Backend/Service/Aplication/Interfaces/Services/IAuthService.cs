using Service.Aplication.DTOs.Auth;

namespace Service.Aplication.Interfaces.Services
{
    public interface IAuthService
    {
        Task<bool> IsUsernameAvailableAsync(string username, CancellationToken ct = default);
        Task<bool> IsEmailAvailableAsync(string email, CancellationToken ct = default);
        Task RegisterUserAsync(CreateUserDto dto, CancellationToken ct = default);
        Task<TokenDto> LoginUserAsync(LoginDto dto, CancellationToken ct = default);
    }
}
