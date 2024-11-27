using Ecommerce.Contracts.DTOs.Authentication;
using Ecommerce.core.Entities.identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.Interfaces
{
    public interface IJwtService
    {
        Task<AuthResponse> CreateJwtToken(AppUser user);

        Task<string> GenerateRefreshToken();

    }
}
