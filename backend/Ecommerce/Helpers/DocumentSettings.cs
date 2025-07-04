using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;

public static class DocumentSettings
{
    public static string UploadFile(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0)
            return string.Empty;

        string folderPath = GetFolderPath(folderName);
        EnsureFolderExists(folderPath);

        string fileHash = GetFileHash(file);
        string extension = Path.GetExtension(file.FileName);
        string newFileName = $"{fileHash}{extension}";
        string newFilePath = Path.Combine(folderPath, newFileName);

        if (!File.Exists(newFilePath))
        {
            using var fileStream = new FileStream(newFilePath, FileMode.Create);
            file.CopyTo(fileStream);
        }

        return newFileName;
    }

    public static bool DeleteFile(string folderName, string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return false;

        string filePath = Path.Combine(GetFolderPath(folderName), fileName);

        if (File.Exists(filePath))
        {
            try
            {
                File.Delete(filePath);
                return true;
            }
            catch
            {
                // log error if needed
                return false;
            }
        }

        return false;
    }

    public static string UpdateFile(IFormFile newFile, string folderName, string? oldFileName = null)
    {
        string newFileName = UploadFile(newFile, folderName);

        // Only delete if old and new file names are different
        if (!string.IsNullOrWhiteSpace(oldFileName) &&
            !string.Equals(oldFileName, newFileName, StringComparison.OrdinalIgnoreCase))
        {
            DeleteFile(folderName, oldFileName);
        }

        return newFileName;
    }

    private static string GetFolderPath(string folderName)
    {
        return Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "image", folderName);
    }

    private static void EnsureFolderExists(string path)
    {
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
    }

    private static string GetFileHash(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        using var sha256 = SHA256.Create();
        byte[] hashBytes = sha256.ComputeHash(stream);
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }
}
