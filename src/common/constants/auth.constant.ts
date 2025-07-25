export const AUTH_CONSTANTS = {
    JWT_STRATEGY: 'jwt',
    LOCAL_STRATEGY: 'local',
    BEARER_TOKEN_PREFIX: 'Bearer ',
    DEFAULT_TOKEN_EXPIRY: '7d',
    DEFAULT_REFRESH_TOKEN_EXPIRY: '30d',
  } as const;
  
  export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCOUNT_DEACTIVATED: 'Account is deactivated',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
  } as const;