import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const backendCredentialsInterceptor: HttpInterceptorFn = (
  request,
  next
) => {
  const apiUrl = environment.apiUrl.replace(/\/+$/, '');

  const isBackendRequest =
    request.url === apiUrl ||
    request.url.startsWith(`${apiUrl}/`) ||
    request.url.startsWith(`${apiUrl}?`);

  if (!isBackendRequest) {
    return next(request);
  }

  return next(request.clone({
    withCredentials: true
  }));
};
