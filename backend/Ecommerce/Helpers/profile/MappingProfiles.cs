using AutoMapper;
using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.Category;
using Ecommerce.Contracts.DTOs.order;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core.Entities;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Entities.order;
using Ecommerce.Helpers.PictureResolver;
using EcommerceContract.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceContract.Helpers.profile
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //order maping
            CreateMap<OrderItem, OrderItemDTO>()
            .ForMember(dest=>dest.PictureUrl,otp=>otp.MapFrom<PictureOrderItemsImageResolver>());

            CreateMap<ShippingAddress, AddressDto>()
                .ForMember(dest => dest.IsActive, otp => otp.Ignore());
           CreateMap<Order, OrderDTO>()
                                .ForMember(dest => dest.PaymentIntentId, otp => otp.Ignore());

            CreateMap<DeliveryMethodsDTO, DeliveryMethod>().ReverseMap();


           CreateMap<Address,AddressDto>().ReverseMap();

           CreateMap<Navbar, NavbarDto>()
          .ForMember(dest => dest.Menus, opt => opt.MapFrom(src => src.Menus))
          .ReverseMap();

           CreateMap<Menu, MenuDto>()
          .ForMember(dest => dest.Links, opt => opt.MapFrom(src => src.Links))
          .ReverseMap();

           CreateMap<MenuLinks, MenuLinkDto>()
          .ReverseMap();

            // Advertisement Mapping
            CreateMap<Advertisement, AdvertisementDTO>()
                .ForMember(dest => dest.LargeImage, opt => opt.MapFrom<PictureLargeImageResoIver>())
                .ForMember(dest => dest.SmallImage, opt => opt.MapFrom<PictureSmallImageResoIver>());
            CreateMap<AdvertisementCreateDto, Advertisement>();

            // Product Mapping
            CreateMap<Product, ProductReadDto>()
                .ForMember(dest => dest.OfferEndDate, opt => opt.MapFrom(src => src.OfferEndDate))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.DeliveryTimeInDays, opt => opt.MapFrom(src => src.DeliveryTimeInDays))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom<PictureProductImageResolver>());
                

            CreateMap<ProductReadDto, Product>()
                .ForMember(dest => dest.OfferEndDate, opt => opt.MapFrom(src => src.OfferEndDate))
                 .ForMember(dest => dest.DeliveryTimeInDays, opt => opt.MapFrom(src => src.DeliveryTimeInDays))
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore());

            CreateMap<ProductCreateDto, Product>()
                 .ForMember(dest => dest.DeliveryTimeInDays, opt => opt.MapFrom(src => src.DeliveryTimeInDays))
                .ForMember(des=>des.ProductStatus,opt=>opt.Ignore());

            CreateMap<ProductCreateDto, Product>()
                  .ForMember(dest => dest.id, opt => opt.Ignore())
                  .ForMember(dest => dest.ImageUrl, opt => opt.Ignore())
                  .ForMember(dest => dest.LinkImage, opt => opt.Ignore())
                  .ForMember(dest => dest.ProductStatus, opt => opt.Ignore())
                  .ForMember(dest => dest.ProductAttributes, opt => opt.Ignore())
                  .ForMember(dest => dest.SKU, opt => opt.Ignore())
                  .ForMember(dest => dest.OfferPrice, opt => opt.Ignore())
                  .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null))
;


            // Product Status Mapping
            CreateMap<ProductStatus, ProductStatusDTO>()
                .ReverseMap();

            CreateMap<Status,StatusDto>().ReverseMap();

            // Category Mapping
            CreateMap<Category, CategoryRequestDto>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom<PictureCategoryImageResolver>())
                .ReverseMap();

            CreateMap<ProductAttributes, ProductAttributeDto>()
              .ForMember(dest => dest.AttributeName, opt => opt.MapFrom(src => src.Attribute.Name))
              .ForMember(dest => dest.AttributeValue, opt => opt.MapFrom(src => src.AttributeValue.Value));



        }
    }
}
