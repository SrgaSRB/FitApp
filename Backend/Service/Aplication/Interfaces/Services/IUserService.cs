using Service.Aplication.DTOs.User;

namespace Service.Aplication.Interfaces.Services
{
    public interface IUserService
    {
         Task<UserInfoDto> GetUserInfoAsync(Guid userId, CancellationToken ct = default);
        Task UpdateUserInfoAsync(Guid userId, UpdateUserDto userInfo, CancellationToken ct = default);
    }
}
