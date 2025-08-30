using Microsoft.AspNetCore.Mvc;
using Properties.Application.Interface.Utils;
using Properties.Contracts.DTO.Utils;

namespace Properties.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto loginDto)
        {
            var token = _userService.Login(loginDto.Username, loginDto.Password);

            if (token == null)
                return Unauthorized(new { message = "Credenciales inválidas" });

            return Ok(new { token });
        }
    }
}
