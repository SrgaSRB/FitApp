using Service.Domain.Enums;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace Service.Aplication.DTOs.Auth
{
    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Gender { get; set; }
        public DateTime Birthday { get; set; }
        public double Weight { get; set; }
        public int Height { get; set; }
        public string Password { get; set; } = string.Empty;
    }

}
