using AutoMapper;
using Ecommerce.Contracts.DTOs.Category;
using Ecommerce.core;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Ecommerce.Core;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
 
    public class CategoryController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public CategoryController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("GetCategory/{id}")]
        [ProducesResponseType(typeof(CategoryRequestDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BaseApiResponse>> GetCategory(int categoryId)
        {
            var Category = await GetCategoryWithId(categoryId);
            if (Category == null) {
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "Categoty Not Found"));
            }
            var CategoryMap= _mapper.Map<Category,CategoryRequestDto>(Category);   
            return Ok(CategoryMap);    
        }

        [HttpGet("GetAllCategorys")]
        [ProducesResponseType(typeof(IReadOnlyList<CategoryRequestDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BaseApiResponse>> GetAllCategorys()
        {
            var Categorys = await _unitOfWork.Repository<Category>().GetAllWithSpecAsync(new CategoryWithSpecictions());
            if (Categorys is null)
            {
                return NotFound(new BaseApiResponse(StatusCodes.Status404NotFound, "Categorys Not Found"));
            }
            var Categores = _mapper.Map<IReadOnlyList<Category>, IReadOnlyList<CategoryRequestDto>>(Categorys);
            return Ok(Categores);
        }



        private async Task<Category> GetCategoryWithId(int id)
        {
            return await _unitOfWork.Repository<Category>().GetByIdSpecAsync(new CategoryWithSpecictions(id));

        }
    }
}
