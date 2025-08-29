using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IPropertyImageService
    {
        Task<PropertyImageDto> CreateWithValidationAsync(PropertyImageDto dto);
        Task<List<PropertyImageDto>> GetAllAsync();
        Task<PropertyImageDto?> GetByIdAsync(int id);
    }
}
