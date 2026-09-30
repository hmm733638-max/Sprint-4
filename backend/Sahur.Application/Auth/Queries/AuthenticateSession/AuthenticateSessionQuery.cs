using Sahur.Application.Messaging;

namespace Sahur.Application.Auth.Queries.AuthenticateSession;

public sealed record AuthenticateSessionQuery(string AccessToken) : IQuery<AuthenticatedUserReadModel?>;
