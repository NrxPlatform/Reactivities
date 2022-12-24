using Microsoft.AspNetCore.Mvc;
using Application.Core;
using Microsoft.Extensions.DependencyInjection;
using MediatR;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BaseApiController : ControllerBase
{
    protected IMediator Mediator => HttpContext.RequestServices.GetService<IMediator>()!;

    protected ActionResult HandleResult<T>(Result<T> result){
        if (result == null) return NotFound();

        if (result.IsSuccess && result.Value != null)
            return Ok(result.Value);

        if (result.IsSuccess && result.Value == null)
            return NotFound();

        return BadRequest(result.Error);
    }

}