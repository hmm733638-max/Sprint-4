using System.ComponentModel.DataAnnotations;

namespace Sahur.Api.Contracts;

public sealed record LoginRequest([Required] string Username, [Required] string Password);
