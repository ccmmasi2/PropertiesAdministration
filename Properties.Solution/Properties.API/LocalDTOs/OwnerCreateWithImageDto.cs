using System.ComponentModel.DataAnnotations;
using static Properties.Contracts.Enums.Enumerators;

namespace Properties.API.LocalDTOs
{
    public record OwnerCreateWithImageDto
    {
        [Required, MaxLength(200)]
        public string Name { get; init; } = default!;

        [Required]
        public IdentificationType IdentificationType { get; init; } = default!;

        [Required, MaxLength(15)]
        public string Identification { get; init; } = default!;

        [Required, MaxLength(500)]
        public string Address { get; init; } = default!;

        [Required]
        public IFormFile? Photo { get; init; }

        [Required]
        public DateTime BirthDay { get; init; } = default!;
    }
}
