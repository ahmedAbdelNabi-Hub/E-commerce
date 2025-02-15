using AutoMapper;
using Ecommerce.Contracts.DTOs;
using Ecommerce.core.Entities.identity;
using Ecommerce.Core;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Specifications;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce.Controllers
{
    public class AccountController : BaseController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;


        public AccountController(UserManager<AppUser> userManager , IUnitOfWork unitOfWork,IMapper mapper)
        {
          _userManager = userManager;
          _unitOfWork = unitOfWork;
            _mapper = mapper;
        } 

        [HttpGet("account-details")]
        public async Task<ActionResult<AppUser>> GetAccountDetails(int userId)
        {
            var user = await FindUserByClaims();
            if (user == null) return Unauthorized(401);
            return Ok(user);
        }


        [HttpPost("address")]
        public async Task<ActionResult<BaseApiResponse>> AddAddress([FromBody] AddressDto addressDto)
        {
            var addressRepo = _unitOfWork.Repository<Address>();
            var user = await FindUserByClaims();
            if (user == null) return Unauthorized(401);
            var address = _mapper.Map<Address>(addressDto);
            address.UserId = user!.Id;
            await addressRepo.AddAsync(address);
            return await SaveChangesAsync(_unitOfWork, "The Address Create successful", "failed , Please try again later");
        }

        [HttpGet("addresses")]
        public async Task<ActionResult<IReadOnlyList<Address>>> GetUserAddresses()
        {
            var addressRepo = _unitOfWork.Repository<Address>();
            var user = await FindUserByClaims();
            if (user == null) return Unauthorized(401);
            var addresses = await addressRepo.GetAllWithSpecAsync(new AddressWithSpecifcation(A=>A.UserId==user!.Id));    
            return Ok(addresses);   
        }

        private async Task<AppUser?> FindUserByClaims()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null) return null;
            var user = await _userManager.FindByEmailAsync(email);
            return user;    
        }
    }
}

