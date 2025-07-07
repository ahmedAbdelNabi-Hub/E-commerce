using Ecommerce.core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Entities
{
    public class ProductFeature : BaseEntity
    {
          public string Title { get; set; }
          public string Description { get; set; }
          public string VideoUrl { get; set; }
          public string ImageCoverUrl { get; set; }
          public int ProductId { get; set; }
          public Product Product { get; set; }
    }
}
