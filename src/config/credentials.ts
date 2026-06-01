import { environment } from './environment';

export const adminCredentials = {
  email:    environment.adminEmail,
  password: environment.adminPassword,
} as const;
