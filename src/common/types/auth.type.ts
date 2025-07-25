export interface AuthUser {
    sub: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  }
  
  export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  }