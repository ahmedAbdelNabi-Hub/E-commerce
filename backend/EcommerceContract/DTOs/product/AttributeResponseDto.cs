using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class AttributeResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<AttributeValueDto>? Values { get; set; }
    }
}
