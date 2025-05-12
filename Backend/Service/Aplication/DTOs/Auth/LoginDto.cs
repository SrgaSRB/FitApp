using System.Globalization;

namespace Service.Aplication.DTOs.Auth
{
    public class LoginDto
    {
        public string UsernameOrEmail { get; set; }
        public string Password { get; set; }
    }
}
