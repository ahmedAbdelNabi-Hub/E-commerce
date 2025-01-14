using AutoMapper;
using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Ecommerce.Core;
using Ecommerce.Core.Specifications;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{

    public class ProductStatusController : BaseController
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public ProductStatusController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("GetAllStatuses")]
        public async Task<ActionResult<IReadOnlyList<StatusDto>>> GetAllStatuses()
        {
            var statuses = await _unitOfWork.Repository<Status>().GetAllWithSpecAsync(new StatuesSpecification());
            if (statuses == null || !statuses.Any())
            {
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "No statuses found"));
            }

            var statusDtoList = _mapper.Map<List<StatusDto>>(statuses);
            return Ok(statusDtoList);
        }


        [HttpGet("GetProductsByStatus")]
        public async Task<ActionResult<PaginationDto<ProductReadDto>>> GetProductsByStatus([FromQuery] ProductSpecParams Params)
        {
            var productStatusRepo = _unitOfWork.Repository<ProductStatus>();
            var productsWithStatus = await productStatusRepo.GetAllWithSpecAsync(new ProductStatusWithSpecifications(Params));
            if (productsWithStatus == null || !productsWithStatus.Any())
            {
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "No products found for the given status"));
            }

            var productDtoList = _mapper.Map<IReadOnlyList<ProductReadDto>>(productsWithStatus.Select(ps => ps.Product));
            var countSpec = new ProductStatusWithSpecifications().CountProductBeforePagination(Params);
            var countProductBeforPagination = await productStatusRepo.CountWithSpec(countSpec);
            return Ok(new PaginationDto<ProductReadDto>() { PageIndex = Params.PageIndex, PageSize = Params.PageSize, data = productDtoList, Count = countProductBeforPagination });
        }


        [HttpPost("AssignStatus")]
        public async Task<ActionResult<BaseApiResponse>> AssignStatusToProduct([FromBody] ProductStatusDTO productStatusDto)
        {
            var existStatus = await _unitOfWork.Repository<Status>().GetByIdSpecAsync(new StatuesSpecification(productStatusDto.StatusId));
            if (existStatus == null)
            {
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "Failed, Status not found"));
            }

            var existProduct = await GetExistingProduct(productStatusDto.ProductId);
            if (existProduct == null)
            {
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "Failed, Product not found"));
            }

            var productStatusRepo = _unitOfWork.Repository<ProductStatus>();
            var existProductStatus = await productStatusRepo.GetByIdSpecAsync(new ProductStatusWithSpecifications(productStatusDto.ProductId, productStatusDto.StatusId));
            if (existProductStatus != null)
            {
                return BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest, $"This product already has the status: {existStatus.StatusName}"));
            }

            var productStatusMapping = _mapper.Map<ProductStatus>(productStatusDto);
            await productStatusRepo.AddAsync(productStatusMapping);

            return await SaveChangesAsync(_unitOfWork, $"Product assigned status: {existStatus.StatusName} successfully", "Failed to add status");
        }


        [HttpDelete("DeleteProductStatus/{productId}/{statusId}")]
        public async Task<ActionResult<BaseApiResponse>> DeleteProductStatus(int productId, int statusId)
        {
            var productStatusRepo = _unitOfWork.Repository<ProductStatus>();
            var existingProductStatus = await productStatusRepo.GetByIdSpecAsync(new ProductStatusWithSpecifications(productId, statusId));

            if (existingProductStatus == null)
            {
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "Product status not found"));
            }

            await productStatusRepo.DeleteAsync(existingProductStatus);
            return await SaveChangesAsync(_unitOfWork, "Product status deleted successfully", "Failed to delete product status");
        }



        private async Task<Product> GetExistingProduct(int id)
        {
            return await _unitOfWork.Repository<Product>().GetByIdSpecAsync(new ProductWithSpecifcations(id));
        }
    }
}
