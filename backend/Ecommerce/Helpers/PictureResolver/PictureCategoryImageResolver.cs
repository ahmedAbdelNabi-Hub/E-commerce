using AutoMapper;
using Ecommerce.Contracts.DTOs.Category;
using Ecommerce.core.Entities;

namespace Ecommerce.Helpers.PictureResolver
{
    public class PictureCategoryImageResolver : IValueResolver<Category, CategoryRequestDto, string>
    {
        private readonly IConfiguration _configuration;
        public PictureCategoryImageResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string Resolve(Category source, CategoryRequestDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.Image))
            {
                var PictureWithParts = source.Image;
                return $"{_configuration["ApiBaiseUrl"]}/image/Categories/{PictureWithParts}";
            }

            return "";
        }
    }
}
