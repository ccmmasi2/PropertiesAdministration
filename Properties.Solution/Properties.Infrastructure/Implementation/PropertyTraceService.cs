using Microsoft.EntityFrameworkCore;
using Properties.Application.Exceptions;
using Properties.Application.Interface;
using Properties.Application.Interface.Utils;
using Properties.Contracts.DTO;
using Properties.Domain;

namespace Properties.Infrastructure.Implementation
{
    public class PropertyTraceService : IPropertyTraceService
    {
        private readonly AppDbContext _db;

        public PropertyTraceService(AppDbContext db, ITraceLogger logger)
        {
            _db = db;
        }

        public async Task<List<PropertyTraceDto>> GetAllAsync()
        {
            var dtos = await _db.PropertyTraces
                 .Select(x => new PropertyTraceDto
                 {
                     IdPropertyTrace = x.IdPropertyTrace,
                     DateState = x.DateState,
                     Name = x.Name,
                     Value = x.Value,
                     Tax = x.Tax,
                     IdProperty = x.IdProperty
                 }).ToListAsync();
            return dtos;
        }

        public async Task<PropertyTraceDto?> GetByIdAsync(int id)
        {
            var propertyTrace = await _db.PropertyTraces
                .Where(x => x.IdPropertyTrace == id)
                .Select(x => new PropertyTraceDto
                {
                    IdPropertyTrace = x.IdPropertyTrace,
                    DateState = x.DateState,
                    Name = x.Name,
                    Value = x.Value,
                    Tax = x.Tax,
                    IdProperty = x.IdProperty
                })
                .FirstOrDefaultAsync();

            if (propertyTrace == null)
                throw new NotFoundException($"Property Trace with ID {id} not found.");

            return propertyTrace;
        }

        public async Task<PropertyTraceDto> CreateWithValidationAsync(PropertyTraceDto dto)
        {
            var exists = await _db.PropertyTraces.AnyAsync(x =>
                                                    x.Name == dto.Name && x.IdProperty == dto.IdProperty);
            if (exists)
                throw new InvalidOperationException("Property Image with File {dto.File} and IdProperty {dto.IdProperty} already exists.");

            var propertyTrace = new PropertyTrace(dto.DateState, dto.Name, dto.Value, dto.Tax, dto.IdProperty);
            _db.PropertyTraces.Add(propertyTrace);
            await _db.SaveChangesAsync();

            var resultDto = new PropertyTraceDto
            {
                IdPropertyTrace = propertyTrace.IdPropertyTrace,
                DateState = propertyTrace.DateState,
                Name = propertyTrace.Name,
                Value = propertyTrace.Value,
                Tax = propertyTrace.Tax,
                IdProperty = propertyTrace.IdProperty,
            };
            return resultDto;
        } 
    }
}
