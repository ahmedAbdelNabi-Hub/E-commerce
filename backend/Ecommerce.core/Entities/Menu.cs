using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Entities
{
    public class Menu:BaseEntity
    {
        public string Name {  get; set; }

        public int NavbarId { get; set; }
        public Navbar Navbar { get; set; }  

        public ICollection<MenuLinks> Links { get; set; } 
    }
}
