using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.DTOs
{
    public class EmailDto
    {
       
        public string EmailTo { get; set; }
        public string Subject { get; set; }
        public string? Body { get; set; }
        public IList<IFormFile> Attachments { get; set; }

        public EmailDto()
        {
            Attachments = new List<IFormFile>();
        }
    }
}
