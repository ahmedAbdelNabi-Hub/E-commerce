using AutoMapper;
using Ecommerce.Contracts.DTOs.Category;
using Ecommerce.core;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Ecommerce.Core;
using EcommerceContract.ErrorResponses;
using Google.Apis.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata;

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

        [HttpGet("/api/categories/{id}")]
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

        [HttpGet("/api/categories")]
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

        [HttpPost("/api/categories")]
        public async Task<ActionResult<BaseApiResponse>> Create([FromForm] CategoryCreateDto dto)
        {
            var categoryRep = _unitOfWork.Repository<Category>();
            var categoryExist = await categoryRep.GetByIdSpecAsync(new CategoryWithSpecictions(dto.CategoryName));
            if (categoryExist != null) {
                return BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest, "The Category is Fount Can Not Created it"));
            }
            var filename = DocumentSettings.UploadFile(dto.Image, "Categories");
            if (string.IsNullOrEmpty(filename))
            {
                return BadRequest(new BaseApiResponse(400, "Can Upload Imgage"));
            }
            var category  = new Category()
            {
                CategoryName = dto.CategoryName,
                CategoryType = dto.CategoryType,
                Image = filename
            };
            await categoryRep.AddAsync(category);
            await _unitOfWork.CompleteAsync();
            return Ok(new BaseApiResponse(200, "The Category is Create"));
         }


        private async Task<Category> GetCategoryWithId(int id)
        {
            return await _unitOfWork.Repository<Category>().GetByIdSpecAsync(new CategoryWithSpecictions(id));
        }
    }
}
