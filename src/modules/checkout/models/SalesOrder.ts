export type SalesOrder = {
  id:            number;
  name:          string;
  state:         'draft' | 'sale' | 'done' | 'cancel';
  invoiceStatus: 'no' | 'to invoice' | 'invoiced' | 'upselling';
  amountTotal:   number;
  partnerId:     number;
  partnerEmail:  string | null;
};
