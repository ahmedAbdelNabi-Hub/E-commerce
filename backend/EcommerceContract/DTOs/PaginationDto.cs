using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs
{
    public class PaginationDto<T>
    {
     

        public int PageIndex { get; set; }
        public int PageSize { get; set; }   
        public int Count { get; set; }  
        public IReadOnlyList<T> data { get; set; }
    }
}
