using Properties.Application.Exceptions;
using System.Net;
using System.Text;
using System.Text.Json;

namespace Properties.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var method = context.Request.Method;
                var path = context.Request.Path;
                var body = await ReadRequestBody(context.Request);
                var statusCode = GetStatusCode(ex);

                _logger.LogError(ex, "❌ Error en {Method} {Path}. Body: {Body}",
                                 method, path, body);

                await WriteErrorResponseAsync(context, ex, statusCode);
            }
        }

        private async Task WriteErrorResponseAsync(HttpContext context, Exception exception, int statusCode)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var errorResponse = new
            {
                error = exception.Message,
                status = statusCode
            };

            var result = JsonSerializer.Serialize(errorResponse);
            await context.Response.WriteAsync(result);
        }

        private async Task<string> ReadRequestBody(HttpRequest request)
        {
            request.EnableBuffering();

            request.Body.Position = 0;
            using var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
            string body = await reader.ReadToEndAsync();

            request.Body.Position = 0;
            return body;
        }

        private int GetStatusCode(Exception exception) => exception switch
        {
            NotFoundException => (int)HttpStatusCode.NotFound,
            ConflictException => (int)HttpStatusCode.Conflict,
            BadRequestException => (int)HttpStatusCode.BadRequest,
            _ => (int)HttpStatusCode.InternalServerError
        };
    }
}
