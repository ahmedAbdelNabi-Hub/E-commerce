using AutoMapper;
using Ecommerce.Contracts.DTOs;
using Ecommerce.Controllers;
using Ecommerce.core;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using Ecommerce.Core;
using Ecommerce.Core.Entities;
using Ecommerce.Helpers;
using EcommerceContract.DTOs;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Net;

namespace EcommerceContract.Controllers
{
   
    public class AdvertisementController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public AdvertisementController(IUnitOfWork unitOfWork,IMapper mapper)
        {
            _mapper = mapper;   
            _unitOfWork = unitOfWork;   
        }


        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<AdvertisementDTO>), 200)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IReadOnlyList<AdvertisementDTO>>> GetAdvertisements([FromQuery] bool? isActive)
        {
            var advertisementRepo = _unitOfWork.Repository<Advertisement>();

            var advertisements = isActive.HasValue
                ? await advertisementRepo.GetAllWithSpecAsync(new AdvertisementWithSpecifcation(ad => ad.IsActive == isActive.Value))
                : await advertisementRepo.GetAllWithSpecAsync(new AdvertisementWithSpecifcation());

            if (!advertisements.Any())
            {
                return NotFound(new BaseApiResponse((int)HttpStatusCode.NotFound, "No advertisements found."));
            }

            return Ok(_mapper.Map<IReadOnlyList<Advertisement>, IReadOnlyList<AdvertisementDTO>>(advertisements));
        }




        [HttpPatch("toggle-status/{id}")]
        [ProducesResponseType(typeof(BaseApiResponse), 200)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BaseApiResponse>> ToggleAdvertisementStatus(int id)
        {
            var advertisementRepo = _unitOfWork.Repository<Advertisement>();
            var advertisement = await advertisementRepo.GetByIdSpecAsync(new AdvertisementWithSpecifcation(id));

            if (advertisement == null)
            {
                return NotFound(new BaseApiResponse((int)HttpStatusCode.NotFound, "No advertisement found."));
            }

            advertisement.IsActive = !advertisement.IsActive;

            return await SaveChangesAsync(
                _unitOfWork,
                $"The advertisement status is now {(advertisement.IsActive ? "active" : "inactive")} successfully.",
                "Error updating advertisement status."
            );
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

            return await SaveChangesAsync(_unitOfWork,"Advertisement updated successfully.", "Failed to update the advertisement.");
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
            return await SaveChangesAsync(_unitOfWork, "Advertisement deleted successfully.", "Failed to delete the advertisement.");
        }

        [HttpPost]
        [Route("create")]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status200OK)]
        public async Task<ActionResult<BaseApiResponse>> createAdvertisement([FromForm] AdvertisementCreateDto advertisementDTO)
        {
            var adverRepo = _unitOfWork.Repository<Advertisement>();
            var advertisement = _mapper.Map<Advertisement>(advertisementDTO);
            convertFileImageToLinkImageAndUploadINServier(advertisement, advertisementDTO); 
            await adverRepo.AddAsync(advertisement);
            return await SaveChangesAsync(_unitOfWork, "Advertisement created successfully.", "Failed to create the advertisement.");
        }
        private bool IsValidAdvertisement(AdvertisementDTO advertisementDto)
        {
            return advertisementDto != null;
        }

        private Advertisement convertFileImageToLinkImageAndUploadINServier(Advertisement advertisement, AdvertisementCreateDto advertisementdto)
        {
            string LargeImage = DocumentSettings.UploadFile(advertisementdto.LargeImage!, "Advertisement");
            string SmallImage = DocumentSettings.UploadFile(advertisementdto.SmallImage!, "Advertisement");
            advertisement.SmallImage = SmallImage;
            advertisement.LargeImage = LargeImage;
            return advertisement;

        }

        private async Task<Advertisement> GetAdvertisementByIdAsync(int id)
        {
            var advertisementRepo = _unitOfWork.Repository<Advertisement>();
            var existingAd = await advertisementRepo.GetByIdSpecAsync(new AdvertisementWithSpecifcation(id));
            return existingAd;
        }

    }
}
