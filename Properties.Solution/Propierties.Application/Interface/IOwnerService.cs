using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IOwnerService
    {
        Task<OwnerDto> CreateWithValidationAsync(OwnerDto dto);
        Task<OwnerDto?> GetByIdAsync(int id);
        Task<IEnumerable<OwnerDto>> ObtAllXFilter(string term);
        Task<string> Delete(int id);
        Task<string> Update(OwnerDto dto);
        Task<(IEnumerable<OwnerDto> Items, int TotalCount)> GetAll(int page, int sizePage, string sorting);
    }
}
