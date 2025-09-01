using System.Text.Json.Serialization;
using static Properties.Contracts.Enums.Enumerators;

namespace Estudio.Infrastructure.SeedData.SeedDTO
{
    public class OwnerSeedDto
    {
        public string Name { get; set; } = default!;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public IdentificationType IdentificationType { get; set; } = default!;
        public string Identification { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string Photo { get; set; } = default!;
        public DateTime BirthDay { get; set; } = default!;
    }
}
