using Estudio.Infrastructure.SeedData.SeedDTO;
using Microsoft.EntityFrameworkCore;
using Properties.Domain;
using System.Net;
using System.Text.Json;
using System.Xml.Linq;

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
            SeedProperties();
            SeedPropertyImages();

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

        private void SeedProperties()
        {
            if (_db.Properties.Any()) return;

            var filePath = Path.Combine(AppContext.BaseDirectory, "SeedData", "properties.json");
            var json = File.ReadAllText(filePath);
            var properties = JsonSerializer.Deserialize<List<PropertySeedDto>>(json);

            if (properties is not null)
            {
                var propertyEntities = properties.Select(b => new Property(b.Name, b.Address, b.Price, b.CodeInternal, b.Year, b.IdOwner)).ToList();
                _db.Properties.AddRange(propertyEntities);
            }
        }

        private void SeedPropertyImages()
        {
            if (_db.PropertyImages.Any()) return;

            var filePath = Path.Combine(AppContext.BaseDirectory, "SeedData", "propertyImages.json");
            var json = File.ReadAllText(filePath);
            var propertyImages = JsonSerializer.Deserialize<List<PropertyImagesSeedDto>>(json);

            if (propertyImages is not null)
            {
                var propertyImagesEntities = propertyImages.Select(b => new PropertyImage(b.File, b.Enable, b.IdProperty)).ToList();
                _db.PropertyImages.AddRange(propertyImagesEntities);
            }
        }
    }
}
