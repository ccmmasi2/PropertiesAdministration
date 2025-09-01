using System.ComponentModel.DataAnnotations;
using static Properties.Contracts.Enums.Enumerators;

namespace Properties.Contracts.DTO
{
    public record PropertyDto
    {
        public int IdProperty { get; init; }

        [Required, MaxLength(200)]
        public string Name { get; init; } = default!;

        [Required, MaxLength(500)]
        public string Address { get; init; } = default!;

        public decimal Price { get; init; }

        [Required, MaxLength(50)]
        public string CodeInternal { get; init; } = default!;

        [Required]
        public int Year { get; init; }

        [Required]
        public int IdOwner { get; init; }
        public string? OwnerIdentification { get; init; }
        public IdentificationType? OwnerIdentificationType { get; init; }
        public string? OwnerName { get; init; }
    }
}
