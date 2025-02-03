using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Specifications
{
    public class CategoryWithSpecictions:Specification<Category>
    {
       public CategoryWithSpecictions() { }   
        public CategoryWithSpecictions(int id)
        {
            AddCriteria(c=>c.id == id); 
        }
    }
}
