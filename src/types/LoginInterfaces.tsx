export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  id: number;
  sub: string;
  exp: number;
  iat?: number;
}