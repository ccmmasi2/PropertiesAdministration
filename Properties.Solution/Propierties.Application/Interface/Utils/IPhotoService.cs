namespace Properties.Application.Interface.Utils
{
    public interface IPhotoService
    {
        Task<string> UploadPhotoAsync(Stream file, string fileName, string folderName);
    }
}
