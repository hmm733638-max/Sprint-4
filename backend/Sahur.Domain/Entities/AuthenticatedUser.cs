using Sahur.Domain.Enums;

namespace Sahur.Domain.Entities;

public sealed record AuthenticatedUser(
    int Id,
    string Username,
    string Email,
    string FirstName,
    string LastName,
    UserRole Role);
