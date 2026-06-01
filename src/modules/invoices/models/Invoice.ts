export type Invoice = {
  id:           number;
  name:         string;
  amountTotal:  number;
  state:        'draft' | 'posted' | 'cancel';
  partnerEmail: string | null;
};
