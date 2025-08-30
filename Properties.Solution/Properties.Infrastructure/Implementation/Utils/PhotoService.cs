using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Properties.Application.Interface.Utils;

namespace Properties.Infrastructure.Implementation.Utils
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;

        public PhotoService(Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }

        public async Task<string> UploadPhotoAsync(Stream file, string fileName)
        {
            if (file == null || file.Length == 0)
                throw new InvalidOperationException("File is empty");

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, file),
                Folder = "owners" // Carpeta opcional en tu cuenta
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                throw new InvalidOperationException("Error uploading to Cloudinary");

            return uploadResult.SecureUrl.ToString();
        }
    }
}
