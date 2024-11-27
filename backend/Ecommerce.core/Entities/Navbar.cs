using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Entities
{
    public class Navbar : BaseEntity
    {
        public string Name { get; set; }
        public string Url {  get; set; } 
        public ICollection<Menu>? Menus { get; set; }  
    }
}
