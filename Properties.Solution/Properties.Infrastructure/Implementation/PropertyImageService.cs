using Microsoft.EntityFrameworkCore;
using Properties.Application.Exceptions;
using Properties.Application.Interface;
using Properties.Application.Interface.Utils;
using Properties.Contracts.DTO;
using Properties.Domain;

namespace Properties.Infrastructure.Implementation
{
    public class PropertyImageService : IPropertyImageService
    {
        private readonly AppDbContext _db;

        public PropertyImageService(AppDbContext db, ITraceLogger logger)
        {
            _db = db;
        }

        public async Task<List<PropertyImageDto>> GetAllXPropertyId(int propertyId)
        {
            var dtos = await _db.PropertyImages
                .Where(x => x.IdProperty == propertyId)
                 .Select(x => new PropertyImageDto
                 {
                     IdPropertyImage = x.IdPropertyImage,
                     File = x.File,
                     Enable = x.Enable,
                     IdProperty = x.IdProperty
                 }).ToListAsync();
            return dtos;
        }

        public async Task<PropertyImageDto?> GetByIdAsync(int id)
        {
            var propertyImage = await _db.PropertyImages
                .Where(x => x.IdPropertyImage == id)
                .Select(x => new PropertyImageDto
                {
                    IdPropertyImage = x.IdPropertyImage,
                    File = x.File,
                    Enable = x.Enable,
                    IdProperty = x.IdProperty
                })
                .FirstOrDefaultAsync();

            if (propertyImage == null)
                throw new NotFoundException($"Property Image with ID {id} not found.");

            return propertyImage;
        }

        public async Task<PropertyImageDto> CreateWithValidationAsync(PropertyImageDto dto)
        {
            var exists = await _db.PropertyImages.AnyAsync(x => x.File == dto.File && x.IdProperty == dto.IdProperty);
            if (exists)
                throw new InvalidOperationException("Property Image with File {dto.File} and IdProperty {dto.IdProperty} already exists.");

            var propertyImage = new PropertyImage(dto.File, dto.Enable, dto.IdProperty);
            _db.PropertyImages.Add(propertyImage);
            await _db.SaveChangesAsync();

            var resultDto = new PropertyImageDto
            {
                IdPropertyImage = propertyImage.IdPropertyImage,
                File = propertyImage.File,
                Enable = propertyImage.Enable,
                IdProperty = propertyImage.IdProperty,
            };
            return resultDto;
        }

        public async Task<string> DisableImage(int id)
        {
            var image = await _db.PropertyImages.FindAsync(id);
            if (image is null)
                throw new NotFoundException($"Imagen con ID {id} no encontrada.");

            image.Update(false);

            _db.PropertyImages.Update(image);
            await _db.SaveChangesAsync();

            return $"Imagen con ID {id} deshabilitada correctamente.";
        }
    }
}
