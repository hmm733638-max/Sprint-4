using MediatR;

namespace Sahur.Application.Products.Queries.GetProductCategories;

public sealed record GetProductCategoriesQuery : IRequest<IReadOnlyCollection<string>>;
