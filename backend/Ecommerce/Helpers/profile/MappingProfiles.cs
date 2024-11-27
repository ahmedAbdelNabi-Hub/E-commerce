using AutoMapper;
using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.Category;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core.Entities;
using Ecommerce.Core.Entities;
using Ecommerce.Helpers.PictureResolver;
using EcommerceContract.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceContract.Helpers.profile
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Navbar Mapping
            CreateMap<Navbar, NavbarDto>()
                .ForMember(dest => dest.Menus, opt => opt.MapFrom(src => src.Menus))
                .ReverseMap();

            // Menu Mapping
            CreateMap<Menu, MenuDto>()
                .ForMember(dest => dest.Links, opt => opt.MapFrom(src => src.Links))
                .ReverseMap();

            // MenuLink Mapping
            CreateMap<MenuLinks, MenuLinkDto>()
                .ReverseMap();

            // Advertisement Mapping
            CreateMap<Advertisement, AdvertisementDTO>()
                .ForMember(dest => dest.LargeImage, opt => opt.MapFrom<PictureLargeImageResoIver>())
                .ForMember(dest => dest.SmallImage, opt => opt.MapFrom<PictureSmallImageResoIver>());

            CreateMap<AdvertisementDTO, Advertisement>();

            // Product Mapping
            CreateMap<Product, ProductReadDto>()
                .ForMember(dest => dest.OfferEndDate, opt => opt.MapFrom(src => src.OfferEndDate))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                ;

            CreateMap<ProductReadDto, Product>()
                .ForMember(dest => dest.OfferEndDate, opt => opt.MapFrom(src => src.OfferEndDate))
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore());

            CreateMap<ProductCreateDto, Product>();

            // Product Status Mapping
            CreateMap<ProductStatus, ProductStatusDTO>()
                .ReverseMap();

            CreateMap<Status,StatusDto>().ReverseMap();

            // Category Mapping
            CreateMap<Category, CategoryRequestDto>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom<PictureCategoryImageResolver>())
                .ReverseMap();

            // Product Attributes Mapping
            CreateMap<ProductAttributes, ProductAttributeDto>()
                .ReverseMap();


        }
    }
}
