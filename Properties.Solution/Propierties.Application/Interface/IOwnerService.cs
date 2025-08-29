using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IOwnerService
    {
        Task<OwnerDTO> CreateWithValidationAsync(OwnerDTO dto);
        Task<List<OwnerDTO>> GetAllAsync();
        Task<OwnerDTO?> GetByIdAsync(int id);
    }
}
