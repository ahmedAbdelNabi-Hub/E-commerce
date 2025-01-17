using AutoMapper;
using Ecommerce.core;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Ecommerce.Core;
using EcommerceContract.DTOs;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace EcommerceContract.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public AdvertisementController(IUnitOfWork unitOfWork,IMapper mapper)
        {
            _mapper = mapper;   
            _unitOfWork = unitOfWork;   
        }

        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<AdvertisementDTO>),200)]
        [ProducesResponseType(typeof(IReadOnlyList<BaseApiResponse>), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IReadOnlyList<AdvertisementDTO>>> GetAllAdvertisment() {
            var AdvertismentRepo = _unitOfWork.Repository<Advertisement>();
            var Advertisments = await AdvertismentRepo.GetAllWithSpecAsync(new AdvertisementWithSpecifcation());
            if (!Advertisments.Any()) {

                return NotFound(new BaseApiResponse((int)HttpStatusCode.NotFound, "No Advertisement found."));
            }
            return Ok(_mapper.Map<IReadOnlyList<Advertisement>,IReadOnlyList<AdvertisementDTO>>(Advertisments));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status200OK)]
        public async Task<ActionResult<BaseApiResponse>> UpdateAdvertisement(int id, [FromBody] AdvertisementDTO advertisementDto)
        {
            var existingAd = await GetAdvertisementByIdAsync(id);
            if (existingAd == null)
            {
                return NotFound(new BaseApiResponse((int)HttpStatusCode.NotFound, "Advertisement not found."));
            }

            _mapper.Map(advertisementDto, existingAd); // Map the updates
            await _unitOfWork.Repository<Advertisement>().UpdateAsync(existingAd); // Update the advertisement

            return await SaveChangesAsync("Advertisement updated successfully.", "Failed to update the advertisement.");
        }


        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status200OK)]
        public async Task<ActionResult<BaseApiResponse>> DeleteAdvertisement(int id)
        {
            var existingAd = await GetAdvertisementByIdAsync(id);
            if (existingAd == null)
            {
                return NotFound(new BaseApiResponse((int)HttpStatusCode.NotFound, "Advertisement not found."));
            }
           await _unitOfWork.Repository<Advertisement>().DeleteAsync(existingAd); // Delete the advertisement
            return await SaveChangesAsync("Advertisement deleted successfully.", "Failed to delete the advertisement.");
        }



        private bool IsValidAdvertisement(AdvertisementDTO advertisementDto)
        {
            return advertisementDto != null;
        }
        private async Task<ActionResult<BaseApiResponse>> SaveChangesAsync(string successMessage, string failureMessage)
        {
            var result = await _unitOfWork.CompleteAsync();
            if (result > 0)
            {
                return Ok(new BaseApiResponse((int)HttpStatusCode.OK, successMessage));
            }
            return BadRequest(new BaseApiResponse((int)HttpStatusCode.BadRequest, failureMessage));
        }
        private async Task<Advertisement> GetAdvertisementByIdAsync(int id)
        {
            var advertisementRepo = _unitOfWork.Repository<Advertisement>();
            var existingAd = await advertisementRepo.GetByIdSpecAsync(new AdvertisementWithSpecifcation(id));
            return existingAd;
        }

    }
}
