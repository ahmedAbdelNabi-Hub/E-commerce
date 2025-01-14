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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.service
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;

        public AuthService(IEmailService emailService,UserManager<AppUser> userManager, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
        }


        public async Task<BaseApiResponse> LoginAsync(LoginDTO loginDto)
        {
            // Find user by email
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
               return AuthErrorResponse("email is not Correct");
             
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordValid)
            {
                return AuthErrorResponse("password is not Correct");

            }

            return await _jwtService.CreateJwtToken(user);
        }
        public async Task<BaseApiResponse> RegisterAsync(RegisterDTO registerDto)
        {
            // Check if the email is already in use
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return AuthErrorResponse("The email is already associated with an account.");
            }

            // Create the new user
            var newUser = new AppUser
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.Email.Split('@')[0],
                PhoneNumber = registerDto.PhoneNumber
            };

            // Attempt to create the user with the given password
            var creationResult = await _userManager.CreateAsync(newUser, registerDto.Password);
            if (!creationResult.Succeeded)
            {
                return AuthErrorResponse("User registration failed. Please try again later.", StatusCodes.Status500InternalServerError);
            }

            // Generate email confirmation token
             var emailConfirmationToken = EncodeToken(await _userManager.GenerateEmailConfirmationTokenAsync(newUser));
             string confirmationUrl = $"http://localhost:4200/reset-password?token={Uri.EscapeDataString(emailConfirmationToken)}";

            // Send confirmation email
            var IsSentEmail = await _emailService.SendEmailAsync(newUser.Email, "Confirm your email address", $"<a href=\"{confirmationUrl}\" style=\"color: white; font-size: small; text-decoration: none;\">Confirm Email Address</a>");
            if (IsSentEmail)
            {
                // Registration successful, prompt user to check their email
                return new BaseApiResponse(StatusCodes.Status200OK, "Registration successful! A confirmation email has been sent to your inbox.");
            }
            return new BaseApiResponse(StatusCodes.Status500InternalServerError, "An error occurred while sending the email.");

        }
        public async Task<BaseApiResponse> ForgotPasswordAsync(ForgotPassword forgotPassword)
        {
            var user = await _userManager.FindByEmailAsync(forgotPassword.Email);
            if (user is null)
            {
                return new BaseApiResponse(StatusCodes.Status400BadRequest, "Email does not exist");
            }


            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var vaildToken = EncodeToken(token);
            var praims = new Dictionary<string, string?>
            {
                {"token",vaildToken},
            };

            var callBack = QueryHelpers.AddQueryString(forgotPassword.ClientUrl, praims);
            await _emailService.SendEmailAsync(user.Email, "Rest Password Token", $"<a href='{callBack}'>{callBack}</a>");

            return new BaseApiResponse(StatusCodes.Status200OK);
        }
        public async Task<BaseApiResponse> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto)
        {
            var user = await _userManager.FindByEmailAsync(confirmEmailDto.Email);
            if (user is null)
            {
                return new BaseApiResponse(StatusCodes.Status400BadRequest, "Email does not exist");
            }
            var normalTokenValid = DecodeToken(confirmEmailDto.Token);
            var result = await _userManager.ConfirmEmailAsync(user, normalTokenValid);

            if (result.Succeeded)
            {
                return await _jwtService.CreateJwtToken(user);
            }
            return new BaseApiResponse(StatusCodes.Status400BadRequest, "Email confirmation unsuccessful. Please ensure the link is valid and not expired.");
        }
        public async Task<BaseApiResponse> RestPasswordAsync(RestPasswordDto restPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(restPasswordDto.Email);
            if (user is null)
            {
                return new BaseApiResponse(StatusCodes.Status400BadRequest, "Email does not exist");
            }
            var decodedToken = WebEncoders.Base64UrlDecode(restPasswordDto.Token!);
            var normalToken = Encoding.UTF8.GetString(decodedToken);

            var result = await _userManager.ResetPasswordAsync(user, normalToken, restPasswordDto.Password);
            if (!result.Succeeded)
            {
                return HandleErrors(result);
            }
            return new BaseApiResponse(StatusCodes.Status200OK, "Password reset successful.");
        }


        // Helper method to create AuthResponse
        private BaseApiResponse AuthErrorResponse(string message, int statusCode=400)
        {
            return new BaseApiResponse
            {
                message = message,
                statusCode = statusCode
            };
        }
        private static string EncodeToken(string token)
        {
            var encodedToken = Encoding.UTF8.GetBytes(token);
            return WebEncoders.Base64UrlEncode(encodedToken);
        }
        private static string DecodeToken(string token)
        {
            var decodedToken = WebEncoders.Base64UrlDecode(token);
            return Encoding.UTF8.GetString(decodedToken);
        }
        private ErrorApiResponse HandleErrors(IdentityResult result)
        {
            var errors = result.Errors
                .GroupBy(e => e.Code) // Grouping errors by their code
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description)); // Create a dictionary of errors

            return new ErrorApiResponse(errors); // Return the ErrorApiResponse with grouped errors
        }

    }

}
