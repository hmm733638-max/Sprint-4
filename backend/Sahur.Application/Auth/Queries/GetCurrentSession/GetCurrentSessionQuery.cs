using MediatR;
using Sahur.Domain.Entities;

namespace Sahur.Application.Auth.Queries.GetCurrentSession;

public sealed record GetCurrentSessionQuery : IRequest<AuthenticatedUser?>;
