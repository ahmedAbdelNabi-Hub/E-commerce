using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs.product
{
    public class ProductAttributeDto
    {
        public int AttributeId { get; set; }
        public string? AttributeName { get; set; }

        public int AttributeValueId { get; set; }
        public string? AttributeValue { get; set; }
    }
}
