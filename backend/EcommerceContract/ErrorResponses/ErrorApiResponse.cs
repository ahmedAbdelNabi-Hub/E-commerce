using Ecommerce.Contracts.ErrorResponses;

namespace EcommerceContract.ErrorResponses
{
    public class ErrorApiResponse : BaseApiResponse
    {
        public Dictionary<string, IEnumerable<string>> Errors { get; set; }

        public ErrorApiResponse(Dictionary<string, IEnumerable<string>> errors)
            : base(400) // Assuming BaseApiResponse has a constructor that accepts an integer
        {
            Errors = errors;
        }
    }

}
