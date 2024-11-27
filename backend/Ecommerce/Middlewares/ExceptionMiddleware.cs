using EcommerceContract.ErrorResponses;
using System.Net;
using System.Text.Json;


namespace EcommerceContract.Middlewares
{


    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        public ExceptionMiddleware
            (
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger,
            IHostEnvironment environment
            )
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync (HttpContext Context)
        {
            try
            {
                 await _next(Context);    
            }
            catch (Exception ex) {

                _logger.LogError(ex,ex.Message);
                Context.Response.ContentType = "application/json";
                Context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                var response = _environment.IsDevelopment()
                ? new ExceptionServerResponse(ex.Message, ex.StackTrace ?? "No stack trace available") // Safely getting StackTrace
                : new ExceptionServerResponse("An error occurred. Please try again later.");

                var jsonResponse = JsonSerializer.Serialize(response);
                await Context.Response.WriteAsync(jsonResponse);
            }  
        }
    }

}
