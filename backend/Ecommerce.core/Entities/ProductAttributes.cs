using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class ProductAttributes : BaseEntity
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int AttributeId { get; set; }
        public Attribute Attribute { get; set; }

        public int AttributeValueId { get; set; }
        public AttributeValue AttributeValue { get; set; }
    }
}
