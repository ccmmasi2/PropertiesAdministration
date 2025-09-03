using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IPropertyImageService
    {
        Task<PropertyImageDto> CreateWithValidationAsync(PropertyImageDto dto);
        Task<List<PropertyImageDto>> GetAllXPropertyId(int propertyId);
        Task<PropertyImageDto?> GetByIdAsync(int id);
        Task<string> DisableImage(int id);
    }
}
