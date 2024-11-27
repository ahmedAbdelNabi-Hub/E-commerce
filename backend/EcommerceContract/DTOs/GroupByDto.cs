using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs
{
    public class GroupByDto<TKey, TDto>
    {
        public TKey Key { get; set; }
        public List<TDto> Items { get; set; }
    }
}
