using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class AttributeValue : BaseEntity
    {
        public string Value { get; set; }
        public int AttributeId { get; set; }
        public Attribute Attribute { get; set; }
    }
}
