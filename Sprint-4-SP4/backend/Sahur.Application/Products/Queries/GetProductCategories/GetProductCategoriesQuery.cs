using Sahur.Application.Messaging;

namespace Sahur.Application.Products.Queries.GetProductCategories;

public sealed record GetProductCategoriesQuery : IQuery<IReadOnlyCollection<string>>;
