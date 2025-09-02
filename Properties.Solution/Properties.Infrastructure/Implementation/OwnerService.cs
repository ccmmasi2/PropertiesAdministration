using Microsoft.EntityFrameworkCore;
using Properties.Application.Exceptions;
using Properties.Application.Interface;
using Properties.Application.Interface.Utils;
using Properties.Contracts.DTO;
using Properties.Domain;
using System.Linq.Dynamic.Core;

namespace Properties.Infrastructure.Implementation
{
    public class OwnerService : IOwnerService
    {
        private readonly AppDbContext _db;

        public OwnerService(AppDbContext db, ITraceLogger logger)
        {
            _db = db;
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
                    Photo = x.Photo,
                    BirthDay = x.BirthDay
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

        public async Task<IEnumerable<OwnerDto>> ObtAllXFilter(string term)
        {
            var owners = await _db.Owners
                   .Where(e =>
                       e.Name.Contains(term) ||
                       e.Identification.Contains(term)
                   )
                   .Select(x => new OwnerDto
                   {
                       IdOwner = x.IdOwner,
                       Name = x.Name,
                       IdentificationType = x.IdentificationType,
                       Identification = x.Identification,
                       Address = x.Address,
                       Photo = x.Photo,
                       BirthDay = x.BirthDay
                   })
                   .ToListAsync();

            return owners;
        }

        public async Task<string> Delete(Int64 id)
        {
            var owner = await _db.Owners.FindAsync(id);

            if (owner is null)
                return $"Propietario con el ID {id} no existe";

            _db.Owners.Remove(owner);
            await _db.SaveChangesAsync();

            return $"Propietario con ID {id} eliminado correctamente";
        }

        public async Task<string> Update(OwnerDto dto)
        {
            var owner = await _db.Owners.FindAsync(dto.IdOwner);
            if (owner is null)
                throw new NotFoundException($"Propietario con ID {dto.IdOwner} no encontrado.");

            var exists = await _db.Owners
                .AnyAsync(x => x.Identification.ToLower() == dto.Identification.ToLower()
                               && x.IdOwner != dto.IdOwner);
            if (exists)
                throw new InvalidOperationException($"Ya existe un propietario con la identificación {dto.Identification}.");

            var resultDto = new OwnerDto
            {
                Name = owner.Name,
                IdentificationType = owner.IdentificationType,
                Identification = owner.Identification,
                Address = owner.Address,
                Photo = owner.Photo,
                BirthDay = owner.BirthDay
            };

            _db.Owners.Update(owner);
            await _db.SaveChangesAsync();

            return $"Propietario con ID {dto.IdOwner} actualizado correctamente.";
        }

        public async Task<(IEnumerable<OwnerDto> Items, int TotalCount)> GetAll(int page, int sizePage, string sorting)
        {
            var query = _db.Owners.AsQueryable();

            var totalCount = await query.CountAsync();

            query = query.OrderBy(sorting);

            var owners = await query
                .Skip((page - 1) * sizePage)
                .Take(sizePage)
                .Select(x => new OwnerDto
                {
                    IdOwner = x.IdOwner,
                    Name = x.Name,
                    IdentificationType = x.IdentificationType,
                    Identification = x.Identification,
                    Address = x.Address,
                    Photo = x.Photo,
                    BirthDay = x.BirthDay
                })
                .ToListAsync();

            return (owners, totalCount);
        }
    }
}
