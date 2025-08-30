using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Properties.Application.Interface;
using Properties.Contracts.DTO;

namespace Properties.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyTraceController : ControllerBase
    {
        private readonly IPropertyTraceService _service;

        public PropertyTraceController(IPropertyTraceService service)
        {
            _service = service;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var propertyTraces = await _service.GetAllAsync();
            return Ok(propertyTraces);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var propertyTrace = await _service.GetByIdAsync(id);
            return Ok(propertyTrace);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> Create(PropertyTraceDto dto)
        {
            var created = await _service.CreateWithValidationAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.IdPropertyTrace }, created);
        }
    }
}