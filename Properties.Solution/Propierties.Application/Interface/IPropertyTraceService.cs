using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IPropertyTraceService
    {
        Task<PropertyTraceDto> CreateWithValidationAsync(PropertyTraceDto dto);
        Task<List<PropertyTraceDto>> GetAllAsync();
        Task<PropertyTraceDto?> GetByIdAsync(int id);
    }
}
