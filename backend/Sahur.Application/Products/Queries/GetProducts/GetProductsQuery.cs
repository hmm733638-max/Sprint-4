using MediatR;
namespace Sahur.Application.Products.Queries.GetProducts;
public sealed record GetProductsQuery : IRequest<IReadOnlyCollection<ProductReadModel>>;
public sealed record ProductReadModel(int Id, string Title, decimal Price, string Description, string Category, string Image);
