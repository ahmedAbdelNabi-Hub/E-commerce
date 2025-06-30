using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class Attribute : BaseEntity
    {
        public string Name { get; set; }
        public ICollection<AttributeValue>? Values { get; set; }
    }

}
