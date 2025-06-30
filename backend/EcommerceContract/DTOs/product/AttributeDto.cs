using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class AttributeDto
    {
        public int id;

        [Required]
        public string Name { get; set; }
        public List<string> Values { get; set; }
    }

}
