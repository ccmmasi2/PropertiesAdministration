using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Properties.Contracts.DTO
{
    public record PropertyTraceDto
    {
        public int IdPropertyTrace { get; init; }

        [Required]
        public DateTime DateState { get; init; } = default!;

        [Required, MaxLength(200)]
        public string Name { get; init; } = default!;

        public decimal Value { get; init; }

        public decimal Tax { get; init; }

        [Required]
        public int IdProperty { get; init; }
    }
}
