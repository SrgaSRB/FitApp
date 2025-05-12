using Microsoft.IdentityModel.Tokens;
using Service.Aplication.Configuration;
using Service.Aplication.DTOs.Auth;
using Service.Aplication.Interfaces.Security;
using Service.Domain.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Service.Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        private readonly JwtSettings _settings;
        private readonly byte[] _key;

        public JwtGenerator(IConfiguration cfg)
        {
            _settings = cfg.GetSection("Jwt").Get<JwtSettings>()!;
            _key = Encoding.UTF8.GetBytes(_settings.Secret);
        }

        public TokenDto GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(_key),
                SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(_settings.AccessMinutes);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            string jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return new TokenDto { AccessToken = jwt, Expires = expires };
        }

        public Guid? Validate(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _settings.Issuer,
                    ValidAudience = _settings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(_key)
                }, out SecurityToken validated);

                var jwt = (JwtSecurityToken)validated;
                return Guid.Parse(jwt.Subject);
            }
            catch
            {
                return null;
            }
        }

    }
}
