using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IPropertyService
    {
        Task<PropertyDto> CreateWithValidationAsync(PropertyDto dto);
        Task<List<PropertyDto>> GetAllAsync();
        Task<PropertyDto?> GetByIdAsync(int id);
    }
}
