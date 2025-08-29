using Microsoft.EntityFrameworkCore;
using Properties.Application.Exceptions;
using Properties.Application.Interface;
using Properties.Application.Interface.Utils;
using Properties.Contracts.DTO;
using Properties.Domain;

namespace Properties.Infrastructure.Implementation
{
    public class PropertyService : IPropertyService
    {
        private readonly AppDbContext _db;

        public PropertyService(AppDbContext db, ITraceLogger logger)
        {
            _db = db;
        }

        public async Task<List<PropertyDto>> GetAllAsync()
        {
            var dtos = await _db.Properties
                 .Select(x => new PropertyDto
                 {
                     IdProperty = x.IdProperty,
                     Name = x.Name,
                     Address = x.Address,
                     Price = x.Price,
                     CodeInternal = x.CodeInternal,
                     Year = x.Year,

                     IdOwner = x.IdOwner,
                     OwnerIdentification = x.Owner.Identification,
                     OwnerIdentificationType = x.Owner.IdentificationType,
                     OwnerName = x.Owner.Name
                 }).ToListAsync();
            return dtos;
        }

        public async Task<PropertyDto?> GetByIdAsync(int id)
        {
            var property = await _db.Properties
                .Where(x => x.IdProperty == id)
                .Select(x => new PropertyDto
                {
                    IdProperty = x.IdProperty,
                    Name = x.Name,
                    Address = x.Address,
                    Price = x.Price,
                    CodeInternal = x.CodeInternal,
                    Year = x.Year,

                    IdOwner = x.IdOwner,
                    OwnerIdentification = x.Owner.Identification,
                    OwnerIdentificationType = x.Owner.IdentificationType,
                    OwnerName = x.Owner.Name
                })
                .FirstOrDefaultAsync();

            if (property == null)
                throw new NotFoundException($"Property with ID {id} not found.");

            return property;
        }

        public async Task<PropertyDto> CreateWithValidationAsync(PropertyDto dto)
        {
            var exists = await _db.Properties.AnyAsync(x =>
                                                    x.CodeInternal.ToLower() == dto.CodeInternal.ToLower());
            if (exists)
                throw new InvalidOperationException("Property with CodeInternal {dto.CodeInternal} already exists.");

            exists = await _db.Properties.AnyAsync(x =>
                                                    x.Name.ToLower() == dto.Name.ToLower() && x.IdOwner == dto.IdOwner);
            if (exists)
                throw new InvalidOperationException("Property with Name {dto.Name} and IdOwner {dto.IdOwner} already exists.");

            var property = new Property(dto.Name, dto.Address, dto.Price, dto.CodeInternal, dto.Year, dto.IdOwner);

            _db.Properties.Add(property);
            await _db.SaveChangesAsync();

            var resultDto = new PropertyDto
            {
                IdProperty = property.IdProperty,
                Name = property.Name,
                Address = property.Address,
                Price = property.Price,
                CodeInternal = property.CodeInternal,
                Year = property.Year,

                IdOwner = property.IdOwner,
                OwnerIdentification = property.Owner.Identification,
                OwnerIdentificationType = property.Owner.IdentificationType,
                OwnerName = property.Owner.Name
            };
            return resultDto;
        } 
    }
}
