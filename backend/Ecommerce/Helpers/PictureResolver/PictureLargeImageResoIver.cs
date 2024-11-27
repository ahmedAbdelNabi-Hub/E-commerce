using AutoMapper;
using Ecommerce.core.Entities;
using EcommerceContract.DTOs;

namespace Ecommerce.Helpers.PictureResolver
{
    public class PictureLargeImageResoIver : IValueResolver<Advertisement, AdvertisementDTO, string>
    {

        private readonly IConfiguration _configuration;
        public PictureLargeImageResoIver(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string Resolve(Advertisement source, AdvertisementDTO destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.LargeImage))
            {
                var PictureWithParts = source.LargeImage.Split('/');
                return $"{_configuration["ApiBaiseUrl"]}/image/Advertisement/{PictureWithParts[PictureWithParts.Length - 1]}";
            }

            return "";
        }
    }

}
