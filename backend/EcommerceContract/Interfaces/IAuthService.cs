using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.DTOs.Authentication;
using Ecommerce.Contracts.DTOs.Password;
using Ecommerce.Contracts.ErrorResponses;
using EcommerceContract.ErrorResponses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.Interfaces
{
    public interface IAuthService
    {
        Task<BaseApiResponse> LoginAsync(LoginDTO loginDto);
        Task<BaseApiResponse> RegisterAsync(RegisterDTO registerDto);
        Task <BaseApiResponse> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto);
        Task<BaseApiResponse> RestPasswordAsync(RestPasswordDto restPasswordDto);
        Task<BaseApiResponse> ForgotPasswordAsync(ForgotPassword forgotPassword);
    }
}
