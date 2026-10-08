using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahur.Application.Users.Models;
using Sahur.Application.Users.Queries.GetUsers;

namespace Sahur.Api.Controllers;

[ApiController]
[Authorize(Roles = "Administrador,Auditor")]
[Route("api/users")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class UsersController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<UserDirectoryReadModel>>> GetAll(
        CancellationToken cancellationToken) =>
        Ok(await sender.Send(new GetUsersQuery(), cancellationToken));
}
