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

        [HttpPost]
        [Route("/api/attributes")]
        public async Task<IActionResult> Create([FromBody] AttributeDto dto)
        {
            var existingAttr = await _unitOfWork.Repository<Ecommerce.Core.Entities.Attribute>()
               .GetByIdSpecAsync(new AttributesSpecification(dto.Name));

            if (existingAttr != null)
            {
                return BadRequest(new BaseApiResponse(400, $"Attribute '{dto.Name}' already exists."));
            }

            var attribute = new Ecommerce.Core.Entities.Attribute
            {
                Name = dto.Name,
                Values = dto.Values.Select(v => new AttributeValue { Value = v }).ToList()
            };

            await _unitOfWork.Repository<Ecommerce.Core.Entities.Attribute>().AddAsync(attribute);
            await _unitOfWork.CompleteAsync();

            return Ok(new BaseApiResponse(200, "Create Product Attribute"));
        }

        [HttpGet]
        [Route("/api/attributes")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _unitOfWork.Repository<Ecommerce.Core.Entities.Attribute>()
                .GetAllWithSpecAsync(new AttributesSpecification());
            var result = data.Select(attr => new AttributeResponseDto
            {
                Id = attr.id,
                Name = attr.Name,
                Values = attr.Values.Select(v => new AttributeValueDto { Id = v.id, Value = v.Value }).ToList()
            }).ToList();
            return Ok(result);
        }


        [HttpPut("/api/attributes/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AttributeDto dto)
        {
            var repo = _unitOfWork.Repository<Ecommerce.Core.Entities.Attribute>();
            var attribute = await repo.GetByIdSpecAsync(new AttributesSpecification(id));

            if (attribute == null)
                return NotFound(new BaseApiResponse(404, "Attribute not found"));

            // Check for duplicate name
            var duplicate = await repo.GetByIdSpecAsync(new AttributesSpecification(dto.Name.Trim()));
            if (duplicate != null && duplicate.id != id)
                return BadRequest(new BaseApiResponse(400, "Attribute with the same name already exists"));

            attribute.Name = dto.Name.Trim();

            // --- Get current values from DB
            var existingValues = attribute.Values!.ToList();

            // --- Normalize incoming new values
            var newValues = dto.Values.Select(v => v.Trim()).ToList();

            // --- Step 1: Handle updated or new values
            foreach (var newVal in newValues)
            {
                var existing = existingValues.FirstOrDefault(ev => ev.Value.Equals(newVal, StringComparison.OrdinalIgnoreCase));
                if (existing == null)
                {
                    attribute.Values!.Add(new AttributeValue
                    {
                        Value = newVal,
                        AttributeId = id
                    });
                }
            }

            // --- Step 2: Handle deleted or renamed values
            foreach (var oldVal in existingValues)
            {
                if (!newValues.Contains(oldVal.Value, StringComparer.OrdinalIgnoreCase))
                {
                    var renamed = newValues.Except(existingValues.Select(ev => ev.Value), StringComparer.OrdinalIgnoreCase).FirstOrDefault();
                    if (!string.IsNullOrWhiteSpace(renamed) &&
                        existingValues.Any(ev => ev.id == oldVal.id && ev.Value != renamed))
                    {
                        oldVal.Value = renamed;
                    }
                    else
                    {
                        
                        var productAttrRepo = _unitOfWork.Repository<ProductAttributes>();
                        var relatedProductAttributes = await productAttrRepo
                            .GetAllWithTrackingAsync(new ProductAttributesWithSpecification(oldVal.id,true));

                        foreach (var pa in relatedProductAttributes)
                        {
                            await productAttrRepo.DeleteAsync(pa);
                        }

                        attribute.Values!.Remove(oldVal);
                    }
                }
            }

            try
            {
                await _unitOfWork.CompleteAsync();
                return Ok(new BaseApiResponse(200, "Attribute updated successfully"));
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new BaseApiResponse(500, $"Database error: {ex.InnerException?.Message ?? ex.Message}"));
            }
        }

        //[HttpDelete("/api/attributes/{id}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var repo = _unitOfWork.Repository<Ecommerce.Core.Entities.Attribute>();
        //    var attr = await repo.GetByIdIncludingAsync(id, a => a.Values);

        //    if (attr == null)
        //        return NotFound(new BaseApiResponse(404, "Attribute not found"));

        //    await _unitOfWork.Repository<AttributeValue>().DeleteRangeAsync(attr.Values);
        //    await repo.DeleteAsync(attr);
        //    await _unitOfWork.CompleteAsync();

        //    return Ok(new BaseApiResponse(200, "Attribute deleted successfully"));
        //}
    }
}
