using AutoMapper;
using Ecommerce.Contracts.DTOs.product;
using Ecommerce.Core;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Specifications;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
    public class ProductFeatureController : BaseController
    {
        public readonly IUnitOfWork _unitOfWork;
        public readonly IMapper _mapper;

        public ProductFeatureController(IUnitOfWork unitOfWork , IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet("/api/Features/{productId}")]
        public async Task<ActionResult<BaseApiResponse>> GetAllFeatures(int productId)
        {
            var featureRepo = _unitOfWork.Repository<ProductFeature>();
            var features = await featureRepo.GetByIdSpecAsync(new ProductFeatureSpecification(productId));
            var result = _mapper.Map<List<ProductFeatureDTO>>(features);
            return Ok(result);
        }


        [HttpPost("/api/Features/{productId}")]
        public async Task<ActionResult<BaseApiResponse>> Create (int productId, [FromForm] ProductFeatureDTO dto)
        {
            var featureRepo = _unitOfWork.Repository<ProductFeature>();
            var imageName = DocumentSettings.UploadFile(dto.ImageCoverUrl, "product/feature");
            if (string.IsNullOrEmpty(imageName))
                return BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest, "Can Not Upload the image"));
        
           var freature = _mapper.Map<ProductFeature>(dto);
           freature.ImageCoverUrl = imageName;
           freature.ProductId = productId;
           await featureRepo.AddAsync(freature);
           return Ok(new BaseApiResponse(StatusCodes.Status200OK,"The Product Featrue Created"));
        }

        [HttpPut("/api/Features/{featureId}")]
        public async Task<ActionResult<BaseApiResponse>> UpdateFeature(int featureId, [FromForm] ProductFeatureDTO dto)
        {
            var featureRepo = _unitOfWork.Repository<ProductFeature>();
            var existingFeature = await featureRepo.GetByIdAsync(featureId);
            if (existingFeature == null)
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "Feature not found"));

            _mapper.Map(dto, existingFeature); 

            if (dto.ImageCoverUrl != null)
            {
                var imageName = DocumentSettings.UpdateFile(dto.ImageCoverUrl, "product/feature",existingFeature.ImageCoverUrl);
                if (string.IsNullOrEmpty(imageName))
                    return BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest, "Cannot update image"));
                existingFeature.ImageCoverUrl = imageName;
            }

            await _unitOfWork.CompleteAsync();
            return Ok(new BaseApiResponse(StatusCodes.Status200OK, "Feature updated"));
        }

        [HttpDelete("/api/Features/{featureId}")]
        public async Task<ActionResult<BaseApiResponse>> DeleteFeature(int featureId)
        {
            var featureRepo = _unitOfWork.Repository<ProductFeature>();
            var feature = await featureRepo.GetByIdAsync(featureId);
            if (feature == null)
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "Feature not found"));

            await featureRepo.DeleteAsync(feature);

            return Ok(new BaseApiResponse(StatusCodes.Status200OK, "Feature deleted"));
        }

    }
}
