using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs
{
    public class AdvertisementCreateDto
    {
        [Required(ErrorMessage = "Large image is required")]
        public IFormFile LargeImage { get; set; }

        [Required(ErrorMessage = "Small image is required")]
        public IFormFile SmallImage { get; set; }

        [Required(ErrorMessage = "Link URL is required")]
        [Url(ErrorMessage = "Link URL must be a valid URL")]
        public string LinkUrl { get; set; }

        [MaxLength(255, ErrorMessage = "title cannot be longer than 255 characters")]
        public string? Title { get; set; }

        [MaxLength(255, ErrorMessage = "subtitle cannot be longer than 255 characters")]
        public string? Subtitle { get; set; }

        [MaxLength(500, ErrorMessage = " description cannot be longer than 500 characters")]
        public string? Description { get; set; }

        [RegularExpression("^(left|right)$", ErrorMessage = "Direction must be either 'left' or 'right'")]
        public string? Direction { get; set; }

        public string TargetPage { get; set; }
        public string Section { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}
