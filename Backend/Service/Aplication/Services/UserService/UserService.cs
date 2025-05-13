using Microsoft.Identity.Client;
using SendGrid.Helpers.Errors.Model;
using Service.Aplication.DTOs.User;
using Service.Aplication.Interfaces.Repositories;
using Service.Aplication.Interfaces.Services;

namespace Service.Aplication.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserInfoDto> GetUserInfoAsync(Guid userId, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserInfoAsync(userId, ct);

            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            var retUserInfo = new UserInfoDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.Username,
                Email = user.Email,
                Birthday = user.Birthday.ToUniversalTime(),
                Gender = user.Gender,
                Weight = user.Weight,
                Height = user.Height
            };

            return retUserInfo;

        }

        public async Task UpdateUserInfoAsync(Guid userId, UpdateUserDto dto, CancellationToken ct)
        {
            bool ok = await _userRepository.UpdateUserInfoAsync(userId, dto, ct);
            if (!ok)
                throw new NotFoundException("User not found");
        }
    }
}
