using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Properties.API.LocalDTOs;
using Properties.Application.Interface;
using Properties.Application.Interface.Utils;
using Properties.Contracts.DTO;

namespace Properties.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OwnerController : ControllerBase
    {
        private readonly IOwnerService _service;
        private readonly IPhotoService _photoService;
        private readonly ILogger<OwnerController> _logger;

        public OwnerController(IOwnerService service, IPhotoService photoService, ILogger<OwnerController> logger)
        {
            _service = service;
            _photoService = photoService;
            _logger = logger;
        } 

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<object>>> GetAll(int page = 1, int sizePage = 10, string sorting = "IdOwner")
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
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var owner = await _service.GetByIdAsync(id);
            return Ok(owner);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] OwnerCreateWithImageDto dto)
        {
            string? photoUrl = null;
            if (dto.Photo != null)
            {
                var photoName = $"Owner_{dto.Identification}_{DateTime.Now:yyyyMMddHHmmssfff}";
                await using var stream = dto.Photo.OpenReadStream();
                photoUrl = await _photoService.UploadPhotoAsync(stream, photoName, "owners");
            }

            var dtoToService = new OwnerDto
            {
                Name = dto.Name,
                IdentificationType = dto.IdentificationType,
                Identification = dto.Identification,
                Address = dto.Address,
                Photo = photoUrl,
                BirthDay = dto.BirthDay
            };

            var created = await _service.CreateWithValidationAsync(dtoToService);
            return CreatedAtAction(nameof(GetById), new { id = created.IdOwner }, created);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("ObtAllXFilter")]
        public async Task<IActionResult> ObtAllXFilter(string term)
        {
            var result = await _service.ObtAllXFilter(term.ToLower());
            if (result.Any())
            {
                return Ok(result);
            }
            return NotFound("No se encontraron empleados con el filtro");
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

            try
            {
                var result = await _service.Delete(id);
                return Ok(result);
            }
            catch (DbUpdateException ex)
                when (ex.InnerException is SqliteException sqliteEx && sqliteEx.SqliteErrorCode == 19)
            {
                return Conflict($"No se puede eliminar el propietario con ID {id} porque tiene entidades que dependen de él");
            }
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPut("Update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> Update([FromBody] OwnerDto owner)
        {
            if (owner == null || owner.IdOwner == 0)
            {
                _logger.LogError("Owner data or ID must be provided!");
                return BadRequest("No se enviaron datos");
            }

            try
            {
                var result = await _service.Update(owner);
                return Ok(result);
            }
            catch (SqlException ex) when (ex.Number == 2601 || ex.Number == 2627)
            {
                return Conflict("La identificación del propietario ya existe.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating owner: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}