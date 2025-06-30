using Ecommerce.core.Specifications;
using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Ecommerce.Core.Specifications
{
    public class AttributesSpecification : Specification<Ecommerce.Core.Entities.Attribute>
    {
        public AttributesSpecification()
        {
            AddInclude(p => p.Values);
        }
        public AttributesSpecification(string name)
        {
            AddCriteria(a => a.Name == name);
        }
        public AttributesSpecification(int id)
        {
            AddCriteria(a => a.id == id);
            AddInclude(a => a.Values);
        }
    }
}
