using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Specifications
{
    public class ProductSpecParams
    {
        public string? CategoryName { get; set; }    
        public int? StatusId { get; set; }  
        public int PageIndex { get; set; } = 1 ;
        private int pageSize = 8;

        public int PageSize {

            get { return pageSize;}
            set { pageSize = value > 10 ? 10 : value; }
        }

    }
}
