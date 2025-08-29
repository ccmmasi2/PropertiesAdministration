using Microsoft.EntityFrameworkCore;
using Properties.Domain;

namespace Properties.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Owner> Owners => Set<Owner>();
        public DbSet<Property> Properties => Set<Property>();
        public DbSet<PropertyImage> PropertyImages => Set<PropertyImage>();
        public DbSet<PropertyTrace> PropertyTraces => Set<PropertyTrace>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Owner>(builder =>
            { 
                builder.HasKey(x => x.IdOwner);
                builder.Property(x => x.IdOwner)
                    .ValueGeneratedOnAdd();

                builder.Property(x => x.Name)
                    .HasMaxLength(200)
                    .IsRequired();

                builder.Property(x => x.IdentificationType)
                    .HasConversion<string>()
                    .HasMaxLength(3)
                    .IsRequired();

                builder.Property(x => x.Identification)
                    .HasMaxLength(15)
                    .IsRequired();

                builder.Property(x => x.Address)
                    .HasMaxLength(500)
                    .IsRequired();

                builder.Property(x => x.Photo)
                    .HasMaxLength(5000)
                    .IsRequired();

                builder.Property(x => x.BirthDay)
                    .IsRequired();

                builder.HasIndex(x => new { x.Identification })
                    .IsUnique();
            });

            modelBuilder.Entity<Property>(builder =>
            {
                builder.HasKey(x => x.IdProperty);
                builder.Property(x => x.IdProperty)
                    .ValueGeneratedOnAdd();

                builder.Property(x => x.Name)
                    .HasMaxLength(50)
                    .IsRequired();

                builder.Property(x => x.Address)
                    .HasMaxLength(500)
                    .IsRequired();

                builder.Property(x => x.Price)
                    .IsRequired();

                builder.Property(x => x.CodeInternal)
                    .HasMaxLength(50)
                    .IsRequired();

                builder.Property(x => x.Year)
                    .IsRequired();

                builder.Property(x => x.IdOwner)
                    .IsRequired();

                builder.HasOne(x => x.Owner)
                    .WithMany(x => x.Properties)
                    .HasForeignKey(x => x.IdOwner)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasIndex(x => new { x.CodeInternal })
                    .IsUnique();

                builder.HasIndex(x => new { x.Name, x.IdOwner })
                    .IsUnique();
            });
             
            modelBuilder.Entity<PropertyImage>(builder =>
            {
                builder.HasKey(x => x.IdPropertyImage);
                builder.Property(x => x.IdPropertyImage)
                    .ValueGeneratedOnAdd();

                builder.Property(x => x.File)
                    .HasMaxLength(5000)
                    .IsRequired();

                builder.Property(x => x.Enable)
                    .HasDefaultValue(true);

                builder.Property(x => x.IdProperty)
                    .IsRequired();

                builder.HasOne(x => x.Property)
                    .WithMany(x => x.PropertyImages)
                    .HasForeignKey(x => x.IdProperty)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasIndex(x => new { x.File, x.IdProperty })
                    .IsUnique();
            });

            modelBuilder.Entity<PropertyTrace>(builder =>
            {
                builder.HasKey(x => x.IdPropertyTrace);
                builder.Property(x => x.IdPropertyTrace)
                    .ValueGeneratedOnAdd();

                builder.Property(x => x.DateState)
                    .IsRequired();

                builder.Property(x => x.Name)
                    .HasMaxLength(50)
                    .IsRequired();

                builder.Property(x => x.Value)
                    .IsRequired();

                builder.Property(x => x.Tax)
                    .IsRequired();

                builder.Property(x => x.IdProperty)
                    .IsRequired();

                builder.HasOne(x => x.Property)
                    .WithMany(x => x.PropertyTraces)
                    .HasForeignKey(x => x.IdProperty)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasIndex(x => new { x.Name, x.IdProperty })
                    .IsUnique();
            });
        }
    }
}
