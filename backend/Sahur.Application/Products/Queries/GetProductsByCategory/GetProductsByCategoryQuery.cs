using Sahur.Application.Messaging;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProductsByCategory;

public sealed record GetProductsByCategoryQuery(string Category)
    : IQuery<IReadOnlyCollection<ProductReadModel>>;
