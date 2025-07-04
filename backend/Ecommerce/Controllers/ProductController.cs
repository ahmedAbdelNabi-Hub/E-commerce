using AutoMapper;
using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.order;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Ecommerce.Core;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Entities.order;
using Ecommerce.Core.Repositories;
using Ecommerce.Core.Specifications;
using Ecommerce.Extensions;
using Ecommerce.Helpers;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.Json;


namespace Ecommerce.Controllers
{

    public class ProductController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private IBasketRepository<ProductViewDto> _basketRepository;
       
        public ProductController(IUnitOfWork unitOfWork, IMapper mapper, IBasketRepository<ProductViewDto> basketRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;

        }

        [HttpGet]
        [Route("/api/products/{id}")]
        public async Task<ActionResult<ProductReadDto>> GetProduct(int id, [FromQuery] string viewId, [FromQuery] bool isStoreInRedis)
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdSpecAsync(new ProductWithSpecifcations(id));
            if (product == null)
                return NotFound(new BaseApiResponse(404, "Product not found."));
            var fullProductDto = _mapper.Map<Product, ProductReadDto>(product);
            if (isStoreInRedis && !string.IsNullOrEmpty(viewId))
            {
                var productViews = await _basketRepository.GetBasketAsync(viewId);

                if (productViews == null)
                {
                    productViews = new ProductViewDto
                    {
                        viewId = viewId,
                        ProductReadDto = new List<ProductReadDto>()
                    };
                }

                var exists = productViews.ProductReadDto.Any(p => p.Id == product.id);
                if (!exists)
                {
                    var redisDto = _mapper.Map<Product, ProductReadDto>(product);
                    redisDto.ProductAttributes = new List<ProductAttributeDto>();
                    productViews.ProductReadDto.Add(redisDto);
                    await _basketRepository.UpdateBasketAsync(viewId, productViews);
                }
            }

            return Ok(fullProductDto);
        }

        [HttpGet]
        [Route("/api/products/recent/{id}")]
        public async Task<ActionResult<PaginationDto<ProductReadDto>>> GetRecentlyViewedProducts(string id)
        {
            var RecentlyProducts =  await _basketRepository.GetBasketAsync(id);
            if (RecentlyProducts == null)
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound,"The Product Not Found of This Key"));
            var newRecentlyProducts = new PaginationDto<ProductReadDto>()
            {
                Count = 0,
                PageIndex = 1,
                PageSize = 10,
                data = RecentlyProducts.ProductReadDto.Take(10).ToList()
            };
            return newRecentlyProducts;
        }

        [HttpGet]
        [Route("/api/products")]
        public async Task<ActionResult<PaginationDto<ProductReadDto>>> GetAllProduct([FromQuery] ProductSpecParams Params)
        {
            var productRepo = _unitOfWork.Repository<Product>();
            var product = await productRepo.GetAllWithSpecAsync(new ProductWithSpecifcations(Params));
            if (product is null)
                return NotFound(new BaseApiResponse(404, "products not found."));

                 var MappingProducts = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductReadDto>>(product);
                 var countSpec = new ProductWithSpecifcations().CountProductBeforePagination(Params);
                 var countProductBeforPagination = await productRepo.CountWithSpec(countSpec); 
                return Ok(new PaginationDto<ProductReadDto>() { PageIndex = Params.PageIndex , PageSize = Params.PageSize, data=MappingProducts ,Count= countProductBeforPagination });
        }

        [HttpPost]
        [Route("/api/products")]
        public async Task<ActionResult<BaseApiResponse>> CreateProduct([FromForm] ProductCreateDto request)
        {
            var attributesJson = Request.Form["ProductAttributes"];
            if (!string.IsNullOrWhiteSpace(attributesJson))
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                request.ProductAttributes = JsonSerializer.Deserialize<List<ProductAttributeDto>>(attributesJson, options)!;
            }

            var existCategory = await _unitOfWork.Repository<Category>()
                .GetByIdSpecAsync(new CategoryWithSpecictions(request.CategoryId));

            if (existCategory is null)
                return NotFound(new BaseApiResponse(404, "Category not found."));

            var product = _mapper.Map<ProductCreateDto, Product>(request);

            var mainImageName = DocumentSettings.UploadFile(request.ImageFile!, "product");
            product.ImageUrl = mainImageName;
            product.LinkImage = mainImageName;

            product.SKU = ProductHelper.GenerateSKU(product.CategoryId, product.Brand, product.CreatedAt, product.id);
            product.OfferPrice = ProductHelper.CalculateOfferPrice(product.Price, product.Discount);

           
            await _unitOfWork.Repository<Product>().AddAsync(product);
            await _unitOfWork.CompleteAsync();

            // ✅ Add thumbnails (if any) using AddRangeAsync
            if (request.Thumbnails?.Any() == true)
            {
                var productImages = request.Thumbnails
                    .Select(thumbnail =>
                    {
                        var imageName = DocumentSettings.UploadFile(thumbnail, "product/thumbnails");
                        return new ProductImage
                        {
                            ProductId = product.id,
                            ImageUrl = imageName,
                            LinkImage = imageName
                        };
                    }).ToList();

                await _unitOfWork.Repository<ProductImage>().AddRangeAsync(productImages);
            }

            // ✅ Add product attributes (if any) using AddRangeAsync
            if (request.ProductAttributes?.Any() == true)
            {
                var attributes = request.ProductAttributes
                    .Select(attr => new ProductAttributes
                    {
                        ProductId = product.id,
                        AttributeId = attr.AttributeId,
                        AttributeValueId = attr.AttributeValueId
                    }).ToList();

                await _unitOfWork.Repository<ProductAttributes>().AddRangeAsync(attributes);
            }

            // Save all changes together
            return await SaveChangesAsync(_unitOfWork, "Product added successfully", "Failed to add product");
        }

        [HttpPut]
        [Route("/api/products/{id}")]
        public async Task<ActionResult<BaseApiResponse>> UpdateProductAsync(int id, [FromForm] ProductCreateDto productDto)
        {
            var attributesJson = Request.Form["ProductAttributes"];
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            if (!string.IsNullOrWhiteSpace(attributesJson))
            {
                productDto.ProductAttributes = JsonSerializer.Deserialize<List<ProductAttributeDto>>(attributesJson, options)!;
            }
            var productRepo = _unitOfWork.Repository<Product>();
            var existingProduct = await productRepo.GetByIdSpecAsync(new ProductWithSpecifcations(id));
            if (existingProduct is null)
                return NotFound(new BaseApiResponse(404, "Product not found"));

            existingProduct.UpdateFromDto(productDto);

            if (productDto.ImageFile != null)
            {
                existingProduct.ImageUrl = DocumentSettings.UpdateFile(productDto.ImageFile!, "product", existingProduct.ImageUrl);
                existingProduct.LinkImage = existingProduct.ImageUrl;
            }
            if (productDto.Thumbnails != null && productDto.Thumbnails.Any())
            {


                if (existingProduct.ProductImages?.Any() == true)
                {
                    foreach (var image in existingProduct.ProductImages) {
                        DocumentSettings.DeleteFile("Product/thumbnails", image.ImageUrl);
                    }
                    existingProduct.ProductImages.Clear();
                }

                foreach (var thumbnail in productDto.Thumbnails)
                {
                    string thumbImageName = DocumentSettings.UploadFile(thumbnail, "product/thumbnails");

                    existingProduct.ProductImages!.Add(new ProductImage
                    {
                        ImageUrl = thumbImageName,
                        LinkImage = thumbImageName,
                        ProductId = id
                    });
                }
            }


            existingProduct.OfferPrice = ProductHelper.CalculateOfferPrice(productDto.Price, productDto.Discount);
            if (productDto.ProductAttributes is not null)
            {
                var existingAttributes = existingProduct.ProductAttributes.ToList();

                // Remove attributes not in the new list
                var toRemove = existingAttributes
                    .Where(old => !productDto.ProductAttributes.Any(newAttr => newAttr.AttributeId == old.AttributeId))
                    .ToList();

                foreach (var attr in toRemove)
                {
                    existingProduct.ProductAttributes.Remove(attr);
                }

                // Update or add attributes
                foreach (var newAttr in productDto.ProductAttributes)
                {
                    var match = existingAttributes.FirstOrDefault(a => a.AttributeId == newAttr.AttributeId);
                    if (match != null)
                    {
                        // Update value
                        match.AttributeValueId = newAttr.AttributeValueId;
                    }
                    else
                    {
                        // Add new attribute
                        existingProduct.ProductAttributes.Add(new ProductAttributes
                        {
                            ProductId = id,
                            AttributeId = newAttr.AttributeId,
                            AttributeValueId = newAttr.AttributeValueId
                        });
                    }
                }
            }

            try
            {
                await _unitOfWork.CompleteAsync();
                return Ok(new BaseApiResponse(200, "Product updated successfully"));
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new BaseApiResponse(500, $"Database error: {ex.InnerException?.Message ?? ex.Message}"));
            }
        }

        [HttpPatch]
        [Route("/api/products/{id}/activate")]
        public async Task<ActionResult<BaseApiResponse>> activeProduct(int id)
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);   
            if(product is null) return NotFound(new BaseApiResponse(404, "products not found."));
            await _unitOfWork.BeginTransactionAsync();
            product.IsActive = !product.IsActive;
            await  _unitOfWork.CompleteAsync();    
            await _unitOfWork.CommitAsync();
            
            return Ok(new BaseApiResponse(200,"The Product Is Active")); 

        }

        [HttpGet("/api/products/{productId}/attributes")]
        public async Task<ActionResult<List<ProductAttributeDto>>> GetProductAttributes(int productId)
        {
            var spec = new ProductAttributesWithSpecification(productId);
            var productAttributes = await _unitOfWork.Repository<ProductAttributes>().GetAllWithSpecAsync(spec);

            if (productAttributes == null || !productAttributes.Any())
                return NotFound(new BaseApiResponse(404, "No attributes found for this product."));

            var mapped = _mapper.Map<IReadOnlyList<ProductAttributes>, IReadOnlyList<ProductAttributeDto>>(productAttributes);
            return Ok(mapped);
        }

        [HttpDelete]
        [Route("/api/products/{id}")]
        public async Task<ActionResult<BaseApiResponse>> DeleteProduct(int id)
        {
            var existingProduct = await GetExistingProduct(id);
            if (existingProduct == null)
            {
                return NotFound(new BaseApiResponse(404, "Product not found."));
            }
            await _unitOfWork.Repository<Product>().DeleteAsync(existingProduct);

            return await SaveChangesAsync(_unitOfWork, "Product deleted successfully", "Failed to delete product");
        }

        [HttpDelete]
        [Route("/api/products/{id}/status/{statusId}")]
        public async Task<ActionResult<BaseApiResponse>> DeleteproductStatus(int id, int statusId)
        {
            var productStatusRepo = _unitOfWork.Repository<ProductStatus>();
            var productStatusExist = await productStatusRepo.GetByIdSpecAsync(new ProductStatusWithSpecifications(id, statusId));
            if (productStatusExist is not null)
            {
                await productStatusRepo.DeleteAsync(productStatusExist);
                return await SaveChangesAsync(_unitOfWork, "Status Deleted from product successfully", "Failed to Delete status");
            }
            return BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest,"Not Found the Product with Statues"));

        }
       
        [HttpGet]
        [Route("/api/products/offers/grouped")]
        public async Task<ActionResult<IEnumerable<GroupByDto<string, ProductReadDto>>>> GetProductsOnOfferGroupedByCategory()
        {
            var spec = new ProductWithSpecifcations().OnOffer();

            var products = await _unitOfWork.Repository<Product>().GetAllWithSpecAsync(spec);
            var groupedProducts = GroupingHelper.GroupEntitiesByKey<Product, string, ProductReadDto>(
                products,
                p => p.Category.CategoryName,
                _mapper
            );

            return Ok(groupedProducts);
        }

        [HttpGet]
        [Route("/api/products/top-selling")]
        public async Task<ActionResult<IEnumerable<OrderItemDTO>>> GetTopSellingProducts([FromQuery] ProductSpecParams Params)
        {
            var spec = new OrderItemsWithSpecictions();
            var orderItem = await _unitOfWork.Repository<OrderItem>()
                .GetQueryableWithSpec(spec: spec)
                .GroupBy(o => new { o.ProductId, o.ProductName, o.PictureUrl })
                .Select(g => new OrderItemDTO
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.ProductName,
                    PictureUrl = g.Key.PictureUrl,
                    Quantity = g.Sum(x => x.Quantity),
                    Price = g.Sum(x => x.Price * x.Quantity)

                })
                 .OrderByDescending(x => x.Quantity)
                 .Skip(Params.PageSize * (Params.PageIndex - 1)) 
                 .Take(Params.PageSize)
                .ToListAsync();

            return (orderItem);
        }
        private async Task<Product> GetExistingProduct(int id)
        {
            return await _unitOfWork.Repository<Product>().GetByIdSpecAsync(new ProductWithSpecifcations(id));
        }

    }
}
