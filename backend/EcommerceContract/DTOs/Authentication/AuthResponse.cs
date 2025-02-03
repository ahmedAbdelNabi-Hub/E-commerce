using Ecommerce.Contracts.ErrorResponses;
using EcommerceContract.ErrorResponses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Authentication
{
    public class AuthResponse : BaseApiResponse
    {
        public Dictionary<string, IEnumerable<string>> Errors { get; set; } 
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime Expiration { get; set; } = DateTime.MinValue; 
    }
}
