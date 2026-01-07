import Cookies from "js-cookie";
import type { User } from "../types";
import type { JwtPayload } from "../types/LoginInterfaces";

class ApiToken {
// Métodos para manejar token
   setToken(token: string, remember: boolean = false): void {
    const expires = remember ? 7 : 1; // Días
    Cookies.set('jwt_token', token, {
      expires: expires,
      secure: window.location.protocol === 'https:', // Solo HTTPS en producción
      sameSite: 'strict',
      path: '/'
    });
  }

  getToken(): string | null {
    return Cookies.get('jwt_token') || null;
  }

  removeToken(): void {
    Cookies.remove('jwt_token', { path: '/' });
  }


  // Decodificar JWT y extraer payload
  private decodeJwt(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  // Obtener información del usuario desde el JWT
  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeJwt(token);
    if (!payload) return null;

    return {
      id: payload.id,
      subject: payload.sub,
      role: payload.sub==='admin' ? 'admin' : 'user'
    };
  }

  // Verificar si el token es válido
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeJwt(token);
    if (!payload) return false;

    return payload.exp * 1000 > Date.now();
  }

  // Obtener solo el sub del JWT
  getCurrentUserSub(): string | null {
    const user = this.getCurrentUser();
    return user?.subject || null;
  }

  // Obtener solo el id del JWT (si existe)
  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.subject === 'admin' || user?.id === 0;
  }

} export const apiToken = new ApiToken();