using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.Role
{
    public class RoleRequestDto
    {
            [Required(ErrorMessage = "The UserId is required.")]
            public string UserId { get; set; }

            [Required(ErrorMessage = "The RoleName is required.")]
            public string RoleName { get; set; }
        
    }

}
