using Ecommerce.core.Entities;
using Ecommerce.core.Entities.identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class Address : BaseEntity
    {
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public string Area { get; set; }
        public string Landmark { get; set; }
        public string Street { get; set; }
        public bool IsActive { get; set; }

        public string UserId { get; set; }
        public  AppUser User { get; set; }
    }
}
