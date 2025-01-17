using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Authentication
{
    public class GoogleLoginDto
    {

        [Required]
        [MinLength(40,ErrorMessage ="The TokenId Should be 40 character")]
        public string TokenId { get; set; }
    }
}
