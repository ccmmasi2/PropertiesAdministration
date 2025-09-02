using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Properties.Application.Interface;
using Properties.Contracts.DTO;

namespace Properties.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _service;
        private readonly ILogger<PropertyController> _logger;

        public PropertyController(IPropertyService service, ILogger<PropertyController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var property = await _service.GetByIdAsync(id);
            return Ok(property);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> Create(PropertyDto dto)
        {
            var created = await _service.CreateWithValidationAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.IdProperty }, created);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("GetAllXOwnerId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<object>>> GetAllXOwnerId(int ownerId, int page = 1, int sizePage = 10, string sorting = "IdProperty")
        {
            _logger.LogInformation("Get list x Owner Id");
            var LItems = await _service.GetAllXOwnerId(ownerId, page, sizePage, sorting);
            return Ok(LItems);
        }
    }
}