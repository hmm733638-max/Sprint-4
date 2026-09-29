namespace Sahur.Application.Abstractions;

public interface ISessionWriter
{
    Task SignOutAsync(CancellationToken cancellationToken);
}
