namespace Ecommerce.Helpers
{
    public class DocumentSettings
    {
        public static string UploadFile(IFormFile file, string FolderName)
        {
            string FolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\image", FolderName);

            string UniquFileName = $"{Guid.NewGuid()}{file.FileName}";

            string filePath = Path.Combine(FolderPath, UniquFileName);

            using var FileStream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(FileStream);

            return UniquFileName;

        }
    }

}
