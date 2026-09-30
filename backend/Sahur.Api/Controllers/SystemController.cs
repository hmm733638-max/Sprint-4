using MediatR;
using Microsoft.AspNetCore.Mvc;
using Sahur.Application.System.Queries.GetSystemStatus;

namespace Sahur.Api.Controllers;

[ApiController]
[Route("api/system")]
public sealed class SystemController(ISender sender) : ControllerBase
{
    [HttpGet("status")]
    public async Task<ActionResult<SystemStatusReadModel>> GetStatus(
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(
            new GetSystemStatusQuery(),
            cancellationToken);

        return Ok(result);
    }
}
