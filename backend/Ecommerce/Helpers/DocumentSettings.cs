namespace Ecommerce.Helpers
{
    public class DocumentSettings
    {
        public static string UploadFile(IFormFile file, string FolderName)
        {
            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\image", FolderName);

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            string fileHash = GetFileHash(file);

            string existingFile = Directory.GetFiles(folderPath)
                .FirstOrDefault(f => Path.GetFileNameWithoutExtension(f) == fileHash);


            if (existingFile != null)
            {
                return Path.GetFileName(existingFile);
            }

            string uniqueFileName = $"{fileHash}{Path.GetExtension(file.FileName)}";

            string filePath = Path.Combine(folderPath, uniqueFileName);

            using var fileStream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(fileStream);

            return uniqueFileName;
        }

        private static string GetFileHash(IFormFile file)
        {
            using var stream = file.OpenReadStream();
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            byte[] hashBytes = sha256.ComputeHash(stream);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower(); 
        }
    }
}
