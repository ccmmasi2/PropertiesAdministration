using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Properties.Contracts.DTO
{
    public record PropertyImageDto
    {
        public int IdPropertyImage { get; init; }

        [Required, MaxLength(5000)]
        public string File { get; init; } = default!;

        [DefaultValue(true)]
        public bool Enable { get; init; }

        [Required]
        public int IdProperty { get; init; }
    }
}
