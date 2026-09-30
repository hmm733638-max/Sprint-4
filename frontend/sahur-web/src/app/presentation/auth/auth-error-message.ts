import { AuthError } from '../../domain/errors/auth.error';

export function authErrorMessage(error: unknown): string {
  if (!(error instanceof AuthError)) return 'No fue posible iniciar sesión. Inténtalo de nuevo.';
  switch (error.code) {
    case 'credentials': return 'Usuario o contraseña inválidos';
    case 'offline': return 'No tienes conexión. Revisa tu red antes de iniciar sesión.';
    case 'connection': return 'No fue posible conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
    case 'storage': return 'El navegador no permite guardar la sesión. Revisa sus permisos de almacenamiento.';
    case 'unexpected': return 'No fue posible iniciar sesión. Inténtalo de nuevo.';
  }
}
