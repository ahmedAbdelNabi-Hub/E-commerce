using AutoMapper;
using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Ecommerce.Core;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Specifications;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Controllers
{
    public class ProductAttributesController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public ProductAttributesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("{productId}/attrubite")]
        [ProducesResponseType(typeof(BaseApiResponse), 200)]
        public async Task<ActionResult<BaseApiResponse>> AddAttrubiteToProduct(int productId, [FromBody] List<ProductAttributeDto> productAttributesDtoList)
        {
            if (productId <= 0 || productAttributesDtoList == null)
            {
                return BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest));
            }
            var productAttributeRep = _unitOfWork.Repository<ProductAttributes>();
            var product = await _unitOfWork.Repository<Product>().GetByIdSpecAsync(new ProductWithSpecifcations(productId));
            if (product is null)
            {
                return BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest,"Product is not Found"));
            }
            var listOfProductAttributes = _mapper.Map<List<ProductAttributes>>(productAttributesDtoList);
            var tasks = listOfProductAttributes.Select(productAttribute =>
            {
                productAttribute.ProductId = productId;
                return productAttributeRep.AddAsync(productAttribute);
            });

            await Task.WhenAll(tasks);
            return await SaveChangesAsync(_unitOfWork, "Save is successful", "Failed to save the productAttribute");

        }

        [HttpPut("id")]
        [ProducesResponseType(typeof(BaseApiResponse), 200)]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<BaseApiResponse>> UpdateAttribute(int id, [FromBody] List<ProductAttributeDto> productAttributesDtoList)
        {
            if (id <= 0 || productAttributesDtoList == null || !productAttributesDtoList.Any())
            {
                return BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest, "Invalid input data"));
            }

            var product = await _unitOfWork.Repository<Product>().GetByIdSpecAsync(new ProductWithSpecifcations(id));
            if (product is null)
            {
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "Product not found"));
            }

            var productAttributes = _mapper.Map<List<ProductAttributes>>(productAttributesDtoList);
            var productAttributeRep = _unitOfWork.Repository<ProductAttributes>();

            try
            {


                // Use parallelism with chunking for batch updates
                int batchSize = 10; // Define the batch size
                var tasks = productAttributes
                    .Select(attr =>
                    {
                        attr.ProductId = id;
                        return productAttributeRep.UpdateAsync(attr);
                    })
                    .Chunk(batchSize) // Split into batches
                    .Select(batch => Task.WhenAll(batch));

                // Execute all tasks in parallel
                await Task.WhenAll(tasks);

                // Save changes once after processing all batches
                await _unitOfWork.CompleteAsync();

                return Ok(new BaseApiResponse(StatusCodes.Status200OK, "Save is successful"));

            }

            catch (Exception)
            {
                return StatusCode(500, new BaseApiResponse(StatusCodes.Status500InternalServerError, "An error occurred"));
            }
        }


        [HttpGet("filters")]
        public async Task<ActionResult<List<FilterationDto>>> GetProductFilters([FromQuery] string categoryName)
        {
       
            var productAttributeRepo = _unitOfWork.GetProductAttributeRepository();
            if (string.IsNullOrEmpty(categoryName))
            {
                return BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest, "Category name is required."));
            }

            var allProductAttributWithCategory = await productAttributeRepo.GetGroupedProductAttributesAsync(categoryName);
            if (allProductAttributWithCategory is null)
                return BadRequest(new BaseApiResponse(StatusCodes.Status404NotFound, "No filters found for the specified category."));
            var filterationDtos = allProductAttributWithCategory.Select(group => new FilterationDto
            {
                FilterName = group.FilterName,
                FilterValues = group.FilterValues,
                ProductCount = group.ProductCount
            }).ToList();

            return filterationDtos;

        }

    }
}
