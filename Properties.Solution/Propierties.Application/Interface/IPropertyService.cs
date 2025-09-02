using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IPropertyService
    {
        Task<PropertyDto> CreateWithValidationAsync(PropertyDto dto);
        Task<PropertyDto?> GetByIdAsync(int id);
        Task<(IEnumerable<PropertyDto> Items, int TotalCount)> GetAllXOwnerId(int ownerId, int page, int sizePage, string sorting);
        Task<string> Delete(int id);
        Task<string> Update(PropertyDto dto);
    }
}
