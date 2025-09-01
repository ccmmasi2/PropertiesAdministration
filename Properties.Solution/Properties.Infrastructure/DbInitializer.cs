using Estudio.Infrastructure.SeedData.SeedDTO;
using Microsoft.EntityFrameworkCore;
using Properties.Domain;
using System.Text.Json;

namespace Properties.Infrastructure
{
    public class DbInitializer
    {
        private readonly AppDbContext _db;

        public DbInitializer(AppDbContext db)
        {
            _db = db;
        }

        public void Initialize()
        {
            try
            {
                if (_db.Database.GetPendingMigrations().Any())
                {
                    _db.Database.Migrate();
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Migration failed", ex);
            }

            SeedOwners();

            if (_db.ChangeTracker.HasChanges())
                _db.SaveChanges();
        }

        private void SeedOwners()
        {
            if (_db.Owners.Any()) return;

            var filePath = Path.Combine(AppContext.BaseDirectory, "SeedData", "owners.json");
            var json = File.ReadAllText(filePath);
            var owners = JsonSerializer.Deserialize<List<OwnerSeedDto>>(json);

            if (owners is not null)
            {
                var ownerEntities = owners.Select(b => new Owner(b.Name, b.IdentificationType, b.Identification, b.Address, b.Photo, b.BirthDay)).ToList();
                _db.Owners.AddRange(ownerEntities);
            }
        }
    }
}
