using Ecommerce.core.Entities;
using System;

namespace Ecommerce.Core.Entities
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
        public string TargetPage { get; set; }
        public string Section { get; set; }

        public bool IsActive { get; set; } = true;

        // Metadata
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set; } 
    }
}
