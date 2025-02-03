using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Specifications
{
    public class StatuesSpecification :Specification<Status>
    {
        public StatuesSpecification()
        {
            
        }

        public StatuesSpecification(int id)
        {
            AddCriteria(s=>s.id == id);
            AddInclude(s => s.ProductStatus);
        }
    }
}
