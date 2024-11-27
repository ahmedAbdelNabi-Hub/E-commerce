using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Password
{
    public class ForgotPassword
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Client URL is required.")]
        [Url(ErrorMessage = "Invalid URL format.")]
        public string ClientUrl { get; set; }
    }
}
