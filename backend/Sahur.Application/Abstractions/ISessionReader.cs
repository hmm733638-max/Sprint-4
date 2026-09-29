using Sahur.Domain.Entities;

namespace Sahur.Application.Abstractions;

public interface ISessionReader
{
    AuthenticatedUser? GetCurrentUser();
}
