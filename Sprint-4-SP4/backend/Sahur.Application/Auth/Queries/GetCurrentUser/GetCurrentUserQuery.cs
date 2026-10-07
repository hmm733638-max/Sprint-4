using Sahur.Application.Messaging;

namespace Sahur.Application.Auth.Queries.GetCurrentUser;

public sealed record GetCurrentUserQuery(int UserId) : IQuery<AuthenticatedUserReadModel?>;
