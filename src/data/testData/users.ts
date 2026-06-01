import { environment } from '../../config/environment';

export const adminUser = {
  email:    environment.adminEmail,
  password: environment.adminPassword,
} as const;
