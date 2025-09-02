using Microsoft.EntityFrameworkCore;
using Properties.Application.Exceptions;
using Properties.Application.Interface;
using Properties.Application.Interface.Utils;
using Properties.Contracts.DTO;
using Properties.Domain;
using System.Linq.Dynamic.Core;

namespace Properties.Infrastructure.Implementation
{
    public class PropertyService : IPropertyService
    {
        private readonly AppDbContext _db;

        public PropertyService(AppDbContext db, ITraceLogger logger)
        {
            _db = db;
        }

        public async Task<PropertyDto> CreateWithValidationAsync(PropertyDto dto)
        {
            var exists = await _db.Owners.AnyAsync(x => x.IdOwner == dto.IdOwner);
            if (!exists)
                throw new InvalidOperationException("Owner with IdOwner {dto.IdOwner} does not exist");

            exists = await _db.Properties.AnyAsync(x => x.CodeInternal.ToLower() == dto.CodeInternal.ToLower());
            if (exists)
                throw new InvalidOperationException("Property with CodeInternal {dto.CodeInternal} already exists.");

            exists = await _db.Properties.AnyAsync(x => x.Name.ToLower() == dto.Name.ToLower() && x.IdOwner == dto.IdOwner);
            if (exists)
                throw new InvalidOperationException("Property with Name {dto.Name} and IdOwner {dto.IdOwner} already exists.");

            var property = new Property(dto.Name, dto.Address, dto.Price, dto.CodeInternal, dto.Year, dto.IdOwner);
            _db.Properties.Add(property);
            await _db.SaveChangesAsync();

            var resultDto = await _db.Properties
                .Include(p => p.Owner)
                .Where(p => p.IdProperty == property.IdProperty)
                .Select(p => new PropertyDto
                {
                    IdProperty = p.IdProperty,
                    Name = p.Name,
                    Address = p.Address,
                    Price = p.Price,
                    CodeInternal = p.CodeInternal,
                    Year = p.Year,

                    IdOwner = p.IdOwner,
                    OwnerIdentification = p.Owner.Identification,
                    OwnerIdentificationType = p.Owner.IdentificationType,
                    OwnerName = p.Owner.Name
                })
                .FirstAsync();

            return resultDto;
        }

        public async Task<string> Delete(int id)
        {
            var property = await _db.Properties.FindAsync(id);
            if (property is null)
                return $"Propiedad con el ID {id} no existe";

            _db.Properties.Remove(property);
            await _db.SaveChangesAsync();
            return $"Propiedad con ID {id} eliminada correctamente";
        }

        public async Task<string> Update(PropertyDto dto)
        {
            var property = await _db.Properties.FindAsync(dto.IdProperty);
            if (property is null)
                throw new NotFoundException($"Propiedad con ID {dto.IdProperty} no encontrada.");

            var exists = await _db.Properties.AnyAsync(x => x.CodeInternal.ToLower() == dto.CodeInternal.ToLower());
            if (exists)
                throw new InvalidOperationException($"Ya existe una propiedad con el código interno {dto.CodeInternal}.");

            property.Update(dto.Name, dto.Address, dto.Price, dto.CodeInternal, dto.Year, dto.IdOwner);

            _db.Properties.Update(property);
            await _db.SaveChangesAsync();

            return $"Propiedad con ID {dto.IdProperty} actualizada correctamente.";
        }


        public async Task<(IEnumerable<PropertyDto> Items, int TotalCount)> GetAll(int page, int sizePage, string sorting)
        {
            var query = _db.Properties.AsQueryable();

            var totalCount = await query.CountAsync();

            query = query.OrderBy(sorting);

            var properies = await query
                .Skip((page - 1) * sizePage)
                .Take(sizePage)
                .Select(p => new PropertyDto
                {
                    IdProperty = p.IdProperty,
                    Name = p.Name,
                    Address = p.Address,
                    Price = p.Price,
                    CodeInternal = p.CodeInternal,
                    Year = p.Year,

                    IdOwner = p.IdOwner,
                    OwnerIdentification = p.Owner.Identification,
                    OwnerIdentificationType = p.Owner.IdentificationType,
                    OwnerName = p.Owner.Name
                })
                .ToListAsync();

            return (properies, totalCount);
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

        public async Task<(IEnumerable<PropertyDto> Items, int TotalCount)> GetAllXOwnerId(int ownerId, int page, int sizePage, string sorting)
        {
            var query = _db.Properties.AsQueryable();

            var totalCount = await query.CountAsync();

            query = query.OrderBy(sorting);

            var properties = await query
                .Skip((page - 1) * sizePage)
                .Take(sizePage)
                .Where(x => x.IdOwner == ownerId)
                .Select(p => new PropertyDto
                {
                    IdProperty = p.IdProperty,
                    Name = p.Name,
                    Address = p.Address,
                    Price = p.Price,
                    CodeInternal = p.CodeInternal,
                    Year = p.Year,

                    IdOwner = p.IdOwner,
                    OwnerIdentification = p.Owner.Identification,
                    OwnerIdentificationType = p.Owner.IdentificationType,
                    OwnerName = p.Owner.Name
                })
                .ToListAsync();

            return (properties, totalCount);
        }

    }
}
