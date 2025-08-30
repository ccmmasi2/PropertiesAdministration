using Microsoft.EntityFrameworkCore;
using Properties.Application.Exceptions;
using Properties.Application.Interface;
using Properties.Application.Interface.Utils;
using Properties.Contracts.DTO;
using Properties.Domain;

namespace Properties.Infrastructure.Implementation
{
    public class OwnerService : IOwnerService
    {
        private readonly AppDbContext _db;

        public OwnerService(AppDbContext db, ITraceLogger logger)
        {
            _db = db;
        }

        public async Task<List<OwnerDto>> GetAllAsync()
        {
            var dtos = await _db.Owners
                 .Select(x => new OwnerDto
                 {
                     IdOwner = x.IdOwner,
                     Name = x.Name,
                     IdentificationType = x.IdentificationType,
                     Identification = x.Identification,
                     Address = x.Address,
                     Photo = x.Photo
                 }).ToListAsync();
            return dtos;
        }

        public async Task<OwnerDto?> GetByIdAsync(int id)
        {
            var owner = await _db.Owners
                .Where(x => x.IdOwner == id)
                .Select(x => new OwnerDto
                {
                    IdOwner = x.IdOwner,
                    Name = x.Name,
                    IdentificationType = x.IdentificationType,
                    Identification = x.Identification,
                    Address = x.Address,
                    Photo = x.Photo
                })
                .FirstOrDefaultAsync();

            if (owner == null)
                throw new NotFoundException($"Owner with ID {id} not found.");

            return owner;
        }

        public async Task<OwnerDto> CreateWithValidationAsync(OwnerDto dto)
        {
            var exists = await _db.Owners.AnyAsync(x => x.Identification.ToLower() == dto.Identification.ToLower());

            if (exists)
                throw new InvalidOperationException("Owner with Identification {dto.Identification} already exists.");

            var owner = new Owner(dto.Name, dto.IdentificationType, dto.Identification, dto.Address, dto.Photo, dto.BirthDay);
            _db.Owners.Add(owner);
            await _db.SaveChangesAsync();

            var resultDto = new OwnerDto
            {
                IdOwner = owner.IdOwner,
                Name = owner.Name,
                IdentificationType = owner.IdentificationType,
                Identification = owner.Identification,
                Address = owner.Address,
                Photo = owner.Photo,
                BirthDay = owner.BirthDay
            };
            return resultDto;
        } 
    }
}
