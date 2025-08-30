using System.ComponentModel;

namespace Properties.Contracts.DTO.Utils
{
    public class LoginRequestDto
    {
        [DefaultValue("cristian")]
        public string Username { get; set; } = string.Empty;

        [DefaultValue("1234")]
        public string Password { get; set; } = string.Empty;
    }
}
