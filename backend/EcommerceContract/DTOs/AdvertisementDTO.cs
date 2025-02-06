using System.ComponentModel.DataAnnotations;

namespace EcommerceContract.DTOs
{
    public class AdvertisementDTO
    {
        public string Id { get; set; }  

        [Required(ErrorMessage = "Large image is required")]
        [Url(ErrorMessage = "Large image must be a valid URL")]
        public string LargeImage { get; set; }

        [Required(ErrorMessage = "Small image is required")]
        [Url(ErrorMessage = "Small image must be a valid URL")]
        public string SmallImage { get; set; }

        [Required(ErrorMessage = "Link URL is required")]
        [Url(ErrorMessage = "Link URL must be a valid URL")]
        public string LinkUrl { get; set; }

        [MaxLength(255, ErrorMessage = "title cannot be longer than 255 characters")]
        public string Title { get; set; }
      
        [MaxLength(255, ErrorMessage = "subtitle cannot be longer than 255 characters")]
        public string Subtitle { get; set; }

        [MaxLength(500, ErrorMessage = " description cannot be longer than 500 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Direction is required")]
        [RegularExpression("^(left|right)$", ErrorMessage = "Direction must be either 'left' or 'right'")]
        public string Direction { get; set; }

        public string TargetPage { get; set; }
        public string Section { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }

        [Required]  
        public bool IsActive { get; set; }   
    }
}
