export type ProductTestData = {
  id:            number;
  name:          string;
  price:         number;
  type:          'consu' | 'service' | 'combo';
  invoicePolicy: 'order' | 'delivery';
  variantCount:  number;
  categoryName:  string | null;
};
