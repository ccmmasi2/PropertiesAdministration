using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IPropertyService
    {
        Task<OwnerDTO> CreateWithValidationAsync(PropertyDto dto);
        Task<List<PropertyDto>> GetAllAsync();
        Task<PropertyDto?> GetByIdAsync(int id);
    }
}
