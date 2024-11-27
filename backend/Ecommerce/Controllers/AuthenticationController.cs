using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.Authentication;
using Ecommerce.Contracts.DTOs.Password;
using Ecommerce.Contracts.ErrorResponses;
using Ecommerce.Contracts.Interfaces;
using Ecommerce.core.Entities.identity;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Text;
using System.Web;

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

        [HttpPost]
        [Route("ConfirmEmail")]
        public async Task<ActionResult<BaseApiResponse>> ConfirmEmail(ConfirmEmailDto confirmEmailDto)
        {
            var response = await _authService.ConfirmEmailAsync(confirmEmailDto);
            return HandleStatusCode(response);
        }

    }
}

