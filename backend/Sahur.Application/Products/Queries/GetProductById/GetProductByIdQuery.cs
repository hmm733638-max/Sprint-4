using MediatR;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProductById;

public sealed record GetProductByIdQuery(int Id) : IRequest<ProductReadModel?>;
