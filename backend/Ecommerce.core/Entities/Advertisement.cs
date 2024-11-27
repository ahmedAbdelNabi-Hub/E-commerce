using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Entities
{
    public class Advertisement : BaseEntity
    {
        public string LargeImage { get; set; }
        public string SmallImage { get; set; }
        public string LinkUrl { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public string Direction { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

}
