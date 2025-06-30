using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.Authentication;
using Ecommerce.Contracts.DTOs.Password;
using Ecommerce.Contracts.Interfaces;
using Ecommerce.core.Entities.identity;
using EcommerceContract.ErrorResponses;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace Ecommerce.service
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;

        public AuthService(IEmailService emailService, UserManager<AppUser> userManager, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
        }


        public async Task<BaseApiResponse> LoginAsync(LoginDTO loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return AuthErrorResponse("The email is incorrect.");
            }

            if (!user.EmailConfirmed)
            {
                return AuthErrorResponse("Email is not confirmed. Please confirm your email to log in.");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordValid)
            {
                return AuthErrorResponse("The password is incorrect.");
            }

            return await _jwtService.CreateJwtToken(user);
        }

        public async Task<BaseApiResponse> googleLoginAsync(GoogleLoginDto googleLoginDto)
        {
            var setting = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new string[] { "810583915097-vgf50ast4vi6i0fg4aaolahm57k5t5k2.apps.googleusercontent.com" }
            };
            var payload = await GoogleJsonWebSignature.ValidateAsync(googleLoginDto.TokenId, setting);
            if (payload == null)
            {
                return AuthErrorResponse("The TokenId is Valid");
            }
            var existingUser = await _userManager.FindByEmailAsync(payload.Email);
            if (existingUser != null)
            {
                return await _jwtService.CreateJwtToken(existingUser);
            }
            var (creationResult, newUser) = await CreateUserAsync(null, payload);
            if (!creationResult.Succeeded)
            {
                return AuthErrorResponse("User registration failed. Please try again later.", StatusCodes.Status500InternalServerError);
            }
            return await _jwtService.CreateJwtToken(newUser);
        }
        public async Task<BaseApiResponse> RegisterAsync(RegisterDTO registerDto)
        {
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return AuthErrorResponse("The email is already associated with an account.");
            }

         
            var (creationResult, newUser) = await CreateUserAsync(registerDto, null);

            if (!creationResult.Succeeded)
            {
                return AuthErrorResponse("User registration failed. Please try again later.", StatusCodes.Status500InternalServerError);
            }

            // Generate OTP for Two-Factor Authentication
            var otp = await _userManager.GenerateTwoFactorTokenAsync(newUser, TokenOptions.DefaultEmailProvider);
            var encodedOtp = EncodeToken(otp);

           
            var emailBody = $@"
                            <p>Thank you for registering! Please use the following OTP to confirm your email address:</p>
                            <h3>{otp}</h3>
                            <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>";

            var isEmailSent = await _emailService.SendEmailAsync(newUser.Email, "Confirm Your Email Address by OTP", emailBody);
            if (isEmailSent)
            {
                return new BaseApiResponse(StatusCodes.Status200OK, "Registration successful! A confirmation email has been sent to your inbox.");
            }

            return new BaseApiResponse(StatusCodes.Status500InternalServerError, "An error occurred while sending the confirmation email.");
        }

        public async Task<BaseApiResponse> ForgotPasswordAsync(ForgotPassword forgotPassword)
        {
            var user = await _userManager.FindByEmailAsync(forgotPassword.Email);
            if (user is null)
            {
                return new BaseApiResponse(StatusCodes.Status400BadRequest, "Email does not exist");
            }
            var otp = await _userManager.GenerateTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider);

            var isSent = await _emailService.SendEmailAsync(user.Email, "Password Reset Code", $"Your OTP code is: {otp}");

            if (!isSent)
            {
                return new BaseApiResponse(StatusCodes.Status500InternalServerError, "Failed to send OTP. Please try again.");
            }

            return new BaseApiResponse(StatusCodes.Status200OK, "OTP has been sent to your email.");
        }

        public async Task<BaseApiResponse> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto)
        {
            // Find the user by email
            var user = await _userManager.FindByEmailAsync(confirmEmailDto.Email);
            if (user is null)
            {
                return new BaseApiResponse(StatusCodes.Status400BadRequest, "Email does not exist");
            }

            // Verify the provided OTP
            var isOtpValid = await _userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider, confirmEmailDto.OTP);
            if (!isOtpValid)
            {
                return new BaseApiResponse(StatusCodes.Status400BadRequest, "Invalid or expired OTP. Please request a new one.");
            }

            // If OTP is valid, confirm the user's email
            user.EmailConfirmed = true;
            var updateResult = await _userManager.UpdateAsync(user);
            if (updateResult.Succeeded)
            {
                return await _jwtService.CreateJwtToken(user);
            }

            return new BaseApiResponse(StatusCodes.Status500InternalServerError, "An error occurred while confirming the email. Please try again.");
        }

        public async Task<BaseApiResponse> RestPasswordAsync(RestPasswordDto restPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(restPasswordDto.Email);
            if (user is null)
            {
                return new BaseApiResponse(StatusCodes.Status400BadRequest, "Email does not exist");
            }

            var isOtpValid = await _userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider, restPasswordDto.OTP);
            if (!isOtpValid)
            {
                return new BaseApiResponse(StatusCodes.Status400BadRequest, "Invalid or expired OTP.");
            }

            var result = await _userManager.RemovePasswordAsync(user);
            if (!result.Succeeded)
            {
                return new BaseApiResponse(StatusCodes.Status500InternalServerError, "Error removing the old password.");
            }

            result = await _userManager.AddPasswordAsync(user, restPasswordDto.Password);
            if (!result.Succeeded)
            {
                return new BaseApiResponse(StatusCodes.Status500InternalServerError, "Password reset failed.");
            }

            return new BaseApiResponse(StatusCodes.Status200OK, "Password reset successful.");
        }


        // Helper method to create AuthResponse
        private BaseApiResponse AuthErrorResponse(string message, int statusCode = 400)
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

        private async Task<(IdentityResult, AppUser)> CreateUserAsync(RegisterDTO registerDto, GoogleJsonWebSignature.Payload payload)
        {
            IdentityResult creationResult = IdentityResult.Failed();
            AppUser newUser = null;


            if (registerDto != null)
            {
                newUser = new AppUser
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    UserName = registerDto.Email.Split('@')[0],
                    PhoneNumber = registerDto.PhoneNumber
                };

                creationResult = await _userManager.CreateAsync(newUser, registerDto.Password);
            }
            else if (payload != null)
            {
                var nameParts = payload.Name?.Split(" ") ?? new string[] { payload.Name! };
                var firstName = nameParts.Length > 0 ? nameParts[0] : "Unknown";
                var lastName = nameParts.Length > 1 ? nameParts[1] : "User";

                newUser = new AppUser
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = payload.Email,
                    UserName = payload.Email.Split('@')[0],
                    PhoneNumber = null
                };
                creationResult = await _userManager.CreateAsync(newUser);
            }

            return (creationResult, newUser!);
        }

    }
}