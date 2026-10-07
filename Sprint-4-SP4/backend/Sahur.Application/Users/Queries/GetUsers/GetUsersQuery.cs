using Sahur.Application.Messaging;
using Sahur.Application.Users.Models;

namespace Sahur.Application.Users.Queries.GetUsers;

public sealed record GetUsersQuery : IQuery<IReadOnlyCollection<UserDirectoryReadModel>>;
