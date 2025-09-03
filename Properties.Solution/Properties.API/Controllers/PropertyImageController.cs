using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Properties.API.LocalDTOs;
using Properties.Application.Interface;
using Properties.Application.Interface.Utils;
using Properties.Contracts.DTO;

namespace Properties.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyImageController : ControllerBase
    {
        private readonly IPropertyImageService _service;
        private readonly IPhotoService _photoService;

        public PropertyImageController(IPropertyImageService service, IPhotoService photoService)
        {
            _service = service;
            _photoService = photoService;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("GetAllXPropertyId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<object>>> GetAllXPropertyId(int propertyId)
        {
            var propertyImages = await _service.GetAllXPropertyId(propertyId);

            return Ok(propertyImages);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var propertyImage = await _service.GetByIdAsync(id);
            return Ok(propertyImage);
        } 

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] PropertyImageCreateWithImageDto dto)
        {
            string? photoUrl = null;
            if (dto.File != null)
            {
                var photoName = $"PropertyImage_{dto.IdProperty}_{DateTime.Now:yyyyMMddHHmmssfff}";
                await using var stream = dto.File.OpenReadStream();
                photoUrl = await _photoService.UploadPhotoAsync(stream, photoName, "properties");
            }

            var dtoToService = new PropertyImageDto
            {
                File = photoUrl,
                Enable = dto.Enable,
                IdProperty = dto.IdProperty
            };

            var created = await _service.CreateWithValidationAsync(dtoToService);
            return CreatedAtAction(nameof(GetById), new { id = created.IdPropertyImage }, created);
        }
    }
}