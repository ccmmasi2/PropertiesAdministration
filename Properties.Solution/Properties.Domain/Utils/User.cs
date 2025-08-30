namespace Properties.Domain.Utils
{
    public class User
    {
        public string Username { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string Role { get; set; } = default!;
    }
}
