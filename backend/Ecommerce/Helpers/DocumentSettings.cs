public static class DocumentSettings
{
    public static string UploadFile(IFormFile file, string folderName, string? oldFileName = null)
    {
        if (file == null || file.Length == 0)
            return oldFileName ?? string.Empty;

        string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "image", folderName);

        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        string fileHash = GetFileHash(file);
        string extension = Path.GetExtension(file.FileName);
        string newFileName = $"{fileHash}{extension}";
        string newFilePath = Path.Combine(folderPath, newFileName);

        if (File.Exists(newFilePath))
        {
            if (!string.IsNullOrWhiteSpace(oldFileName) &&
                !string.Equals(oldFileName, newFileName, StringComparison.OrdinalIgnoreCase))
            {
                string oldFilePath = Path.Combine(folderPath, oldFileName);
                if (File.Exists(oldFilePath))
                {
                    File.Delete(oldFilePath);
                }
            }

            return newFileName;
        }

        using (var fileStream = new FileStream(newFilePath, FileMode.Create))
        {
            file.CopyTo(fileStream);
        }

        if (!string.IsNullOrWhiteSpace(oldFileName) &&
            !string.Equals(oldFileName, newFileName, StringComparison.OrdinalIgnoreCase))
        {
            string oldFilePath = Path.Combine(folderPath, oldFileName);
            if (File.Exists(oldFilePath))
            {
                File.Delete(oldFilePath);
            }
        }

        return newFileName;
    }

    private static string GetFileHash(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        byte[] hashBytes = sha256.ComputeHash(stream);
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }
}
