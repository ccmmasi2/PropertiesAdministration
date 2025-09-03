using System.ComponentModel.DataAnnotations;

namespace Properties.API.LocalDTOs
{
    public record PropertyImageCreateWithImageDto
    {
        [Required]
        public IFormFile? File { get; init; }

        [Required]
        public int IdProperty { get; init; } = default!;
    }
}
