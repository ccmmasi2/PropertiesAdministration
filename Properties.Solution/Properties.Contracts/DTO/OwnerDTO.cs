using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using static Properties.Contracts.Enums.Enumerators;

namespace Properties.Contracts.DTO
{
    public record OwnerDTO
    {
        public int IdOwner { get; init; }

        [Required, MaxLength(200)]
        public string Name { get; init; } = default!;

        [Required, MaxLength(3)]
        public IdentificationType IdentificationType { get; init; } = default!;

        [Required, MaxLength(15)]
        public string Identification { get; init; } = default!;

        [Required, MaxLength(500)]
        public string Address { get; init; } = default!;

        [DefaultValue("No image yet"), MaxLength(5000)]
        public string? Photo { get; init; }

        [Required]
        public DateTime BirthDay { get; init; } = default!;
    }
}
