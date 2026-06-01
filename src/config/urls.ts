import { environment } from './environment';

const base = environment.odooUrl;

export const urls = {
  base,
  shop:     `${base}/shop`,
  login:    `${base}/web/login`,
  account:  `${base}/my/account`,
  home:     `${base}/my/home`,
  orders:   `${base}/my/orders`,
  invoices: `${base}/my/invoices`,
  admin:    environment.adminUrl,
} as const;
