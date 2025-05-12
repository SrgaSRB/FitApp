using Service.Aplication.DTOs.Auth;
using Service.Domain.Models;

namespace Service.Aplication.Interfaces.Security
{
    public interface IJwtGenerator
    {
        TokenDto GenerateToken(User user);

        Guid? Validate(string token);
    }
}
