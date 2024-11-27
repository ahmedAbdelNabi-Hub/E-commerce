using AutoMapper;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.core;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Ecommerce.Core.Entities;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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


    }
}
