using Properties.Contracts.DTO;

namespace Properties.Application.Interface
{
    public interface IOwnerService
    {
        Task<OwnerDto> CreateWithValidationAsync(OwnerDto dto);
        Task<string> Delete(int id);
        Task<string> Update(OwnerDto dto);
        Task<string> UpdatePhoto(int IdOwner, string PhotoUrl);

        Task<(IEnumerable<OwnerDto> Items, int TotalCount)> GetAll(int page, int sizePage, string sorting);

        Task<OwnerDto?> GetByIdAsync(int id);
        Task<IEnumerable<OwnerDto>> ObtAllXFilter(string term);
    }
}
