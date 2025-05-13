using Service.Domain.Enums;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace Service.Aplication.DTOs.User
{
    public class UserInfoDto
    {
        public string FirstName { get; init; } = string.Empty;
        public string LastName { get; init; } = string.Empty;
        public string Username { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Gender Gender { get; set; }
        public DateTime Birthday { get; set; }
        public double Weight { get; set; }
        public int Height { get; set; }
    }
}
