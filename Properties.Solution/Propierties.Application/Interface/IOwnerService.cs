using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IOwnerService
    {
        Task<OwnerDto> CreateWithValidationAsync(OwnerDto dto);
        Task<List<OwnerDto>> GetAllAsync();
        Task<OwnerDto?> GetByIdAsync(int id);
        Task<IEnumerable<OwnerDto>> ObtAllXFilter(string term);
    }
}
