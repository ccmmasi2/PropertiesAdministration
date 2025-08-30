using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Properties.Application.Interface;
using Properties.Contracts.DTO;

namespace Properties.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyImageController : ControllerBase
    {
        private readonly IPropertyImageService _service;

        public PropertyImageController(IPropertyImageService service)
        {
            _service = service;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var propertyImages = await _service.GetAllAsync();
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
        public async Task<IActionResult> Create(PropertyImageDto dto)
        {
            var created = await _service.CreateWithValidationAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.IdPropertyImage }, created);
        }
    }
}