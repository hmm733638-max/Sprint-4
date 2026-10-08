using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;
using Sahur.Application.Users.Models;

namespace Sahur.Application.Users.Queries.GetUsers;

public sealed class GetUsersQueryHandler(IUserReadRepository users)
    : IQueryHandler<GetUsersQuery, IReadOnlyCollection<UserDirectoryReadModel>>
{
    public Task<IReadOnlyCollection<UserDirectoryReadModel>> Handle(
        GetUsersQuery request,
        CancellationToken cancellationToken) => users.GetAllAsync(cancellationToken);
}
