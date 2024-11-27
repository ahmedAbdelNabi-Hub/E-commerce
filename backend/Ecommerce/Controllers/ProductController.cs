using AutoMapper;
using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Ecommerce.Core.Specifications;
using Ecommerce.Helpers;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Data;
using System.Diagnostics;
using System.Net;

namespace Ecommerce.Controllers
{

    public class ProductController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public ProductController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        [Route("GetProduct/{id}")]
        public async Task<ActionResult<ProductReadDto>> GetProduct(int id)
        {
            var product = await GetExistingProduct(id);
            if (product is null)
                return NotFound(new BaseApiResponse(404, "product not found."));
            else
            {
                var MappingProduct = _mapper.Map<Product, ProductReadDto>(product);
                return Ok(MappingProduct);
            }
        }


        [HttpGet]
        [Route("all/prorduct")]
        public async Task<ActionResult<PaginationDto<ProductReadDto>>> GetAllProduct([FromQuery] ProductSpecParams Params)
        {
            var productRepo = _unitOfWork.Repository<Product>();
            var product = await productRepo.GetAllWithSpecAsync(new ProductWithSpecifcations(Params));
            if (product.IsNullOrEmpty())
                return NotFound(new BaseApiResponse(404, "products not found."));

                var MappingProducts = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductReadDto>>(product);
                 var countSpec = new ProductWithSpecifcations().CountProductBeforePagination(Params);
                 var countProductBeforPagination = await productRepo.CountWithSpec(countSpec); 
                return Ok(new PaginationDto<ProductReadDto>() { PageIndex = Params.PageIndex , PageSize = Params.PageSize, data=MappingProducts ,Count= countProductBeforPagination });
        }

        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<BaseApiResponse>> CreateProduct([FromForm] ProductCreateDto request)
        {
           

            var existCategory = await _unitOfWork.Repository<Category>().GetByIdSpecAsync(new CategoryWithSpecictions(request.CategoryId));
            if(existCategory is null)
            {
                return NotFound(new BaseApiResponse());
            }
            var product = _mapper.Map<ProductCreateDto,Product>(request);
            string imageName = DocumentSettings.UploadFile(request.ImageFile, "product");
            product.ImageUrl = imageName;
            product.LinkImage = imageName;
            product.SKU = ProductHelper.GenerateSKU(product.CategoryId, product.Brand, product.CreatedAt, product.id);
            product.OfferPrice = ProductHelper.CalculateOfferPrice(product.Price, product.Discount);
            await _unitOfWork.Repository<Product>().AddAsync(product);
            return await SaveChangesAsync(_unitOfWork, "Product added successfully form server", "Failed to added product");
        }


        [HttpPut]
        [Route("{id}/Update")]
        public async Task<ActionResult<BaseApiResponse>> UpdateProduct(int id, [FromBody] ProductReadDto updatedProductDto)
        {
            var existingProduct = await GetExistingProduct(id);
            if (existingProduct == null)
            {
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "Product not found."));
            }

            _mapper.Map(updatedProductDto, existingProduct);
            await _unitOfWork.Repository<Product>().UpdateAsync(existingProduct);

            return await SaveChangesAsync(_unitOfWork, "Product updated successfully", "Failed to update product");
        }

        [HttpDelete]
        [Route("{id}/Delete")]
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



    


        [HttpDelete("{id}/RemoveStatus/{statusId}")]
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

        [HttpGet("Offers/Grouped")]
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

        
        [HttpGet("NewArrivals")]
        public async Task<ActionResult<IReadOnlyList<ProductReadDto>>> GetAllNewArrive()
        {

            Stopwatch stopwatch = Stopwatch.StartNew();
            var spc = new ProductWithSpecifcations().newArrive();
            var productIsArrive = await _unitOfWork.Repository<Product>().GetAllWithSpecAsync(spc);

            if (productIsArrive == null)
            {
                stopwatch.Stop();
                Console.WriteLine($"Execution Time: {stopwatch.ElapsedMilliseconds} ms");

                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "No Product is new Arrive"));
            }

            var mappingAllProductIsArrive = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductReadDto>>(productIsArrive);
            stopwatch.Stop();
            Console.WriteLine($"Execution Time: {stopwatch.ElapsedMilliseconds} ms");
            return Ok(mappingAllProductIsArrive);
        }




        private async Task<Product> GetExistingProduct(int id)
        {
            return await _unitOfWork.Repository<Product>().GetByIdSpecAsync(new ProductWithSpecifcations(id));
        }

    }
}
