using Ecommerce.core.Specifications;
using Ecommerce.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Specifications
{
    public class AddressWithSpecifcation : Specification<Address>
    {
        public AddressWithSpecifcation() { }
        public AddressWithSpecifcation(Expression<Func<Address, bool>> criteria) : base(criteria){}
    }
}
