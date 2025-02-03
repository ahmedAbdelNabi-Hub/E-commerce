using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Entities
{
    public class MenuLinks : BaseEntity
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public Menu Menu { get; set; }    
    }
}
