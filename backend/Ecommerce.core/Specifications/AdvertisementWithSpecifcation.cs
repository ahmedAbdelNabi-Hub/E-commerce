using Ecommerce.core.Entities;
using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Specifications
{
    public class AdvertisementWithSpecifcation:Specification<Advertisement> 
    {

        public AdvertisementWithSpecifcation()
        {
            
        }

        public AdvertisementWithSpecifcation(Expression<Func<Advertisement, bool>> criteria) :base(criteria)
        {

        }

        public AdvertisementWithSpecifcation(int id)
        {
            AddCriteria(a=>a.id == id); 
        }
        
    }
}
