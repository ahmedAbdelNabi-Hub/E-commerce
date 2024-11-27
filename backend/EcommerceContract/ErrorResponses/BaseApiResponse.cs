
using Ecommerce.Contracts.ErrorResponses;

namespace EcommerceContract.ErrorResponses
{
    public class BaseApiResponse  
    {
        public string massage {  get; set; }    
        public int statusCode { get; set; }
        public BaseApiResponse()
        {
            
        }
        public BaseApiResponse(int statusCode, string? message = null)
        {
            this.statusCode = statusCode;
            this.massage = message ?? GetDefaultMessageForStatusCode(this.statusCode); ;

        }

        private string GetDefaultMessageForStatusCode(int? statusCode)
        {
            return statusCode switch
            {
                200 => "Request was successful.",
                201 => "Resource was successfully created.",
                204 => "No content.",
                400 => "Bad request.",
                404 => "Resource not found.",
                500 => "An internal server error occurred.",
                _ => "An unexpected error occurred."
            };
        }
    }
}
