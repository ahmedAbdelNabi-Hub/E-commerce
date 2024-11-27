using System.ComponentModel.DataAnnotations;

namespace EcommerceContract.DTOs
{
    public class NavbarDto
    {
        public int Id { get; set; }


        [Required(ErrorMessage = " name is required.")]
        [StringLength(100, ErrorMessage = " name must be between 3 and 100 characters.", MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "URL is required.")]
        [RegularExpression(@"^\/.*$", ErrorMessage = "The URL must start with a forward slash (/).")]
        public string Url { get; set; }

        public List<MenuDto>? Menus { get; set; }
    }
}
