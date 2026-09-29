namespace Sahur.Application.Auth.Models;

public sealed record ExternalUserProfile(
    int Id,
    string Username,
    string Email,
    string FirstName,
    string LastName);
