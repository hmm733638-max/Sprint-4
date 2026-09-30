using MediatR;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProducts;

public sealed record GetProductsQuery : IRequest<IReadOnlyCollection<ProductReadModel>>;
