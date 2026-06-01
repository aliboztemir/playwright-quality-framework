export type Currency = {
  amount: number;
  formatted: string;
};

export type Address = {
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
};

export type Nullable<T> = T | null;
