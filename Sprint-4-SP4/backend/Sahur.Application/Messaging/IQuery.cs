using MediatR;

namespace Sahur.Application.Messaging;

public interface IQuery<out TResponse> : IRequest<TResponse>;
