using Ecommerce.core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Specifications
{
    public class NavbarWithSpecictions:Specification<Navbar>
    {
        public NavbarWithSpecictions()
        {
            AddIncludeExpression(query => query.Include(p => p.Menus).ThenInclude(k => k.Links));
        }

        public NavbarWithSpecictions(int id)
        {
            AddCriteria(n => n.id == id);
        }

    }
}
