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
    public class OwnerController : ControllerBase
    {
        private readonly IOwnerService _service;
        private readonly IPhotoService _photoService;

        public OwnerController(IOwnerService service, IPhotoService photoService)
        {
            _service = service;
            _photoService = photoService;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var owners = await _service.GetAllAsync();
            return Ok(owners);
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
    }
}