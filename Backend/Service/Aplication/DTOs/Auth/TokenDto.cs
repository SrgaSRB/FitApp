using System.Globalization;

namespace Service.Aplication.DTOs.Auth
{
    public class TokenDto
    {
        public string AccessToken { get; set; }
        public DateTime Expires { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshExpires { get; set; }
    }
}
