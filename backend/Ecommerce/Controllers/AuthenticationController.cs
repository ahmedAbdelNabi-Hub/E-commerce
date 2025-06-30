using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.Authentication;
using Ecommerce.Contracts.DTOs.Password;
using Ecommerce.Contracts.Interfaces;
using Ecommerce.core.Entities.identity;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace Ecommerce.Controllers
{

    public class AuthenticationController : BaseController
    {
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtService _jwtService;
        public AuthenticationController(IJwtService jwtService, IAuthService authService, IEmailService emailService, UserManager<AppUser> userManager)
        {
            _emailService = emailService;
            _jwtService = jwtService;
            _authService = authService;
            _userManager = userManager;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<BaseApiResponse>> Register([FromBody] RegisterDTO registerDto)
        {
            var response = await _authService.RegisterAsync(registerDto);
            return HandleStatusCode(response);
        }

        [HttpPost()]
        [Route("google-login")]
        public async Task<ActionResult<BaseApiResponse>> googleLogin([FromBody] GoogleLoginDto googleLoginDto)
        {
            var authResponse = await _authService.googleLoginAsync(googleLoginDto);
            return HandleStatusCode(authResponse);
        }

        [HttpPost("login")]
        public async Task<ActionResult<BaseApiResponse>> Login([FromBody] LoginDTO loginDto)
        {
            var authResponse = await _authService.LoginAsync(loginDto);
            return HandleStatusCode(authResponse);
        }


        [HttpPost]
        [Route("ForgotPassword")]
        public async Task<ActionResult<BaseApiResponse>> ForgotPasswordAsync([FromBody] ForgotPassword forgotPassword)
        {
            var response = await _authService.ForgotPasswordAsync(forgotPassword);
            return HandleStatusCode(response);

        }
        [HttpPost]
        [Route("restPassword")]
        public async Task<ActionResult<BaseApiResponse>> RestPassword([FromBody] RestPasswordDto restPasswordDto)
        {

            var response = await _authService.RestPasswordAsync(restPasswordDto);
            return HandleStatusCode(response);

        }
        [Authorize]
        [HttpGet("GetCurrentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null) return Unauthorized();

            var currentUser = await _userManager.FindByEmailAsync(email);
            if (currentUser == null) return Unauthorized();

            var authResponse = await _jwtService.CreateJwtToken(currentUser);

            var roles = await _userManager.GetRolesAsync(currentUser);
            var userRole = roles.FirstOrDefault() ?? "User"; // default role

            var returnedCurrentUser = new UserDto()
            {
                Email = currentUser.Email,
                Name = $"{currentUser.FirstName} {currentUser.LastName}",
                Token = authResponse.Token,
                Role = userRole
            };

            return Ok(returnedCurrentUser);
        }

        [HttpPost]
        [Route("ConfirmEmail")]
        public async Task<ActionResult<BaseApiResponse>> ConfirmEmail(ConfirmEmailDto confirmEmailDto)
        {
            var response = await _authService.ConfirmEmailAsync(confirmEmailDto);
            return HandleStatusCode(response);
        }

    }
}

