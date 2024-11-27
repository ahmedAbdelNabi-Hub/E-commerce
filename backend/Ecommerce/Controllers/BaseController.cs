using Ecommerce.core;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Ecommerce.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseController : ControllerBase
    {

        protected async Task<ActionResult<BaseApiResponse>> SaveChangesAsync(IUnitOfWork unitOfWork, string successMessage, string failureMessage)
        {
            try
            {
                var result = await unitOfWork.CompleteAsync();

                if (result > 0)
                {
                    return Ok(new BaseApiResponse((int)HttpStatusCode.OK, successMessage));
                }

                return BadRequest(new BaseApiResponse((int)HttpStatusCode.BadRequest, failureMessage));
            }
            catch (Exception ex)
            {
                // Log ex.InnerException for more details
                return new BaseApiResponse(StatusCodes.Status500InternalServerError, ex.InnerException?.Message);
            }
        }


        protected ActionResult<BaseApiResponse> HandleStatusCode(BaseApiResponse authResponse)
        {
            return authResponse.statusCode switch
            {
                200 => Ok(authResponse),
                201 => Created(string.Empty, authResponse),
                400 => BadRequest(authResponse),
                401 => Unauthorized(authResponse),
                403 => Forbid(),
                404 => NotFound(authResponse),
                500 => StatusCode(500, authResponse),
                _ => StatusCode(authResponse.statusCode, authResponse)
            };
        }
    }
}
