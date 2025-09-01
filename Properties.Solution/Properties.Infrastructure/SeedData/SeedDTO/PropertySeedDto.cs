namespace Estudio.Infrastructure.SeedData.SeedDTO
{
    public class PropertySeedDto
    {
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public decimal Price { get; set; } = default!;
        public string CodeInternal { get; set; } = default!;
        public int Year { get; set; } = default!;
        public int IdOwner { get; set; } = default!;
    }
}
