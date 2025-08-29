namespace Properties.Application.Interface.Utils
{
    public interface IUserService
    {
        string? Login(string username, string password);
        string GenerateToken(string username, string role);
    }
}
