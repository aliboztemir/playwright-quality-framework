export type Product = {
  id: number;
  name: string;
  listPrice: number;
  type: 'consu' | 'service' | 'combo';
  invoicePolicy: 'order' | 'delivery';
  variantCount: number;
  isPublished: boolean;
};
