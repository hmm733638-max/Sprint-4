using MediatR;
using Microsoft.AspNetCore.Mvc;
using Sahur.Application.Audit.Commands.CreateAudit;
namespace Sahur.Api.Controllers;
[ApiController]
[Route("api/audit")]
public sealed class AuditController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateAuditRequest request, CancellationToken cancellationToken)
    {
        var id = await sender.Send(new CreateAuditCommand(request.Action), cancellationToken);
        return Ok(id);
    }
}
public sealed record CreateAuditRequest(string Action);
