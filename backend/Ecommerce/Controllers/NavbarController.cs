using AutoMapper;
using Ecommerce.core;
using Ecommerce.core.Entities;
using Ecommerce.core.Specifications;
using EcommerceContract.DTOs;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace EcommerceContract.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NavbarController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public NavbarController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

      
       
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<NavbarDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<NavbarDto>>> GetNavbarsAsync()
        {
            var navbarRepo = _unitOfWork.Repository<Navbar>();
            var navbars = await navbarRepo.GetAllWithSpecAsync(new NavbarWithSpecictions());

            if (!navbars.Any())
                return NotFound(new BaseApiResponse((int)HttpStatusCode.NotFound, "No navbars found."));

            var navbarDtos = _mapper.Map<IEnumerable<NavbarDto>>(navbars);
            return Ok(navbarDtos);
        }

        
        
        [HttpPost]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<BaseApiResponse>> CreateNavbarAsync([FromBody] NavbarDto navbarDto)
        {
            if (!IsValidNavbar(navbarDto))
                return BadRequest(new BaseApiResponse((int)HttpStatusCode.BadRequest, "Invalid Navbar data."));
            navbarDto.Menus ??= new List<MenuDto>();

            var navbar = _mapper.Map<Navbar>(navbarDto);

            var navbarRepo = _unitOfWork.Repository<Navbar>();
            await navbarRepo.AddAsync(navbar);

            if (await SaveChangesAsync())
                return Ok(new BaseApiResponse((int)HttpStatusCode.OK, "Navbar created successfully."));

            return BadRequest(new BaseApiResponse((int)HttpStatusCode.BadRequest, "Failed to create Navbar."));
        }

        
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BaseApiResponse>> DeleteNavbarAsync(int id)
        {
            if (id <= 0)
                return BadRequest(new BaseApiResponse((int)HttpStatusCode.BadRequest, "Invalid Navbar ID."));

            var navbarRepo = _unitOfWork.Repository<Navbar>();
            var navbar = await navbarRepo.GetByIdSpecAsync(new NavbarWithSpecictions(id));

            if (navbar == null)
                return NotFound(new BaseApiResponse((int)HttpStatusCode.NotFound, "Navbar not found."));

            await navbarRepo.DeleteAsync(navbar);    

            if (await SaveChangesAsync())
                return Ok(new BaseApiResponse((int)HttpStatusCode.OK, "Navbar deleted successfully."));

            return BadRequest(new BaseApiResponse((int)HttpStatusCode.BadRequest, "Failed to delete Navbar."));
        }

     
        private bool IsValidNavbar(NavbarDto navbarDto)
        {
            return navbarDto != null ;
        }
        private async Task<bool> SaveChangesAsync()
        {
            return await _unitOfWork.CompleteAsync() > 0;
        }
    }
}
