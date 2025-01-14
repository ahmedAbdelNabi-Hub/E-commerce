using AutoMapper;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core.Entities;

namespace Ecommerce.Helpers.PictureResolver
{
    public class PictureProductImageResolver : IValueResolver<Product, ProductReadDto, string>
    {
        private readonly IConfiguration _configuration;

        public PictureProductImageResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string Resolve(Product source, ProductReadDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.LinkImage))
            {
                var pictureFileName = source.LinkImage;
                return $"{_configuration["ApiBaiseUrl"]}/image/Product/{pictureFileName}";
            }

            return "";
        }
    }
}
