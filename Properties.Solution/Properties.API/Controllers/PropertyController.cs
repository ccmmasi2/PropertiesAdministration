using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
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
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<object>>> GetAll(int page = 1, int sizePage = 10, string sorting = "IdProperty")
        {
            var (items, totalCount) = await _service.GetAll(page, sizePage, sorting);

            var LItems = await _service.GetAll(page, sizePage, sorting);

            return Ok(new
            {
                page,
                sizePage,
                sorting,
                totalCount,
                items
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("GetAllXOwnerId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<object>>> GetAllXOwnerId(int ownerId, int page = 1, int sizePage = 10, string sorting = "IdProperty")
        {
            _logger.LogInformation("Get list x Owner Id");

            var (items, totalCount) = await _service.GetAllXOwnerId(ownerId, page, sizePage, sorting);

            return Ok(new
            {
                page,
                sizePage,
                sorting,
                totalCount,
                items
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("Delete/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<string>> Delete(int id)
        {
            if (id == 0)
                return BadRequest("ID invalido");

            var result = await _service.Delete(id);
            return Ok(result);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPut("Update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> Update([FromBody] PropertyDto property)
        {
            if (property == null || property.IdProperty == 0)
            {
                _logger.LogError("Property data or ID must be provided!");
                return BadRequest("No se enviaron datos");
            }

            try
            {
                var result = await _service.Update(property);
                return Ok(result);
            }
            catch (SqlException ex) when (ex.Number == 2601 || ex.Number == 2627)
            {
                return Conflict("El código interno de la propiedad ya existe.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating property: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}