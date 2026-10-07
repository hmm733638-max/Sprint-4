using Sahur.Application.Messaging;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProductById;

public sealed record GetProductByIdQuery(int Id) : IQuery<ProductReadModel?>;
