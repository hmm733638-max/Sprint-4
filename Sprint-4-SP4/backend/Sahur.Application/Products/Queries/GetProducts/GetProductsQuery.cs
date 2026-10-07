using Sahur.Application.Messaging;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProducts;

public sealed record GetProductsQuery : IQuery<IReadOnlyCollection<ProductReadModel>>;
