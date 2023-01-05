using Microsoft.AspNetCore.Mvc;
using Application.Core;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using WebApi.Extensions;

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

    protected ActionResult HandlePageResult<T>(Result<PagedList<T>> result){
        if (result == null) return NotFound();

        if (result.IsSuccess && result.Value != null)
        {
            Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize,
                result.Value.TotalCount, result.Value.TotalPages);
            return Ok(result.Value);
        }
            
        if (result.IsSuccess && result.Value == null)
            return NotFound();

        return BadRequest(result.Error);
    }

}