using System.ComponentModel.DataAnnotations;

namespace Properties.API.LocalDTOs
{
    public record OwnerUpdateImageDto
    {
        [Required]
        public int IdOwner { get; init; } = default!;

        [Required, MaxLength(15)]
        public string Identification { get; init; } = default!;

        [Required]
        public IFormFile? Photo { get; init; }
    }
}
