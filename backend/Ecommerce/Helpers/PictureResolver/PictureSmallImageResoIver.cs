using AutoMapper;
using Ecommerce.core.Entities;
using Ecommerce.Core.Entities;
using EcommerceContract.DTOs;

namespace Ecommerce.Helpers.PictureResolver
{
    public class PictureSmallImageResoIver : IValueResolver<Advertisement, AdvertisementDTO, string>
    {
        private readonly IConfiguration _configuration;
        public PictureSmallImageResoIver(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string Resolve(Advertisement source, AdvertisementDTO destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.SmallImage))
            {
                var PictureWithParts = source.SmallImage.Split('/');
                return $"{_configuration["ApiBaiseUrl"]}/image/Advertisement/{PictureWithParts[PictureWithParts.Length - 1]}";
            }

            return "";
        }
    }
}
