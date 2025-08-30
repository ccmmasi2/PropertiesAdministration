using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Properties.Application.Interface.Utils;
using Properties.Contracts.Transversals;
using Properties.Domain.Utils;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Properties.Infrastructure.Implementation.Utils
{
    public class UserService : IUserService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly ILogger<UserService> _logger;

        private readonly List<User> _users = new()
        {
            new User { Username = "cristian", PasswordHash = "1234", Role = "Admin" },
            new User { Username = "camilo", PasswordHash = "5678", Role = "User" }
        };

        public UserService(IOptions<JwtSettings> jwtOptions, ILogger<UserService> logger)
        {
            _jwtSettings = jwtOptions.Value;
            _logger = logger;
        }

        public string? Login(string username, string password)
        {
            var user = _users.FirstOrDefault(u =>
                u.Username.Equals(username, StringComparison.OrdinalIgnoreCase) &&
                u.PasswordHash == password);

            if (user == null)
            {
                _logger.LogWarning("Login failed for {User}", username);
                return null;
            }

            return GenerateToken(user.Username, user.Role);
        }

        public string GenerateToken(string username, string role)
        {
            _logger.LogInformation("Generating JWT token for {User}", username);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Convert.FromBase64String(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _jwtSettings.Issuer,
                _jwtSettings.Audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpireMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
