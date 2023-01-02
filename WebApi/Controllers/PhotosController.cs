using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public class PhotosController : BaseApiController {
    [HttpPost]
    public async Task<IActionResult> Add([FromForm] Add.Command command){
        var result = await Mediator.Send(command);
        return HandleResult(result!);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id){
        return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
    }

    [HttpPost("{id}/setMain")]
    public async Task<IActionResult> SetMain(string id){
        return HandleResult(await Mediator.Send(new SetMain.Command{Id = id}));
    }

    
}