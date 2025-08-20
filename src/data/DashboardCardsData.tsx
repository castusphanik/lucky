export interface CardItem {
  title: string;
  value: string;
  color: 'blue' | 'green' | 'red' | 'darkBlue';
}

export const cardData: CardItem[] = [
  { title: 'Total Units (In Lease)', value: '12', color: 'darkBlue' },
  // { title: 'DOT / CVI Scheduled', value: '12', color: 'green' },
  // { title: 'DOT / CVI Overdue', value: '25', color: 'red' },
  { title: 'Total ERS Open', value: '12', color: 'blue' },
  { title: 'Total Service Request Open', value: '12', color: 'darkBlue' },
  { title: 'Total Units (In Rent)', value: '12', color: 'blue' },
  { title: 'Total Invoice Amount', value: '27', color: 'blue' },
  { title: 'Invoices Paid', value: '8', color: 'blue' },
  { title: 'Invoices Overdue', value: '12', color: 'red' },
  { title: 'Total Work Order Open', value: '25', color: 'blue' },
  { title: 'Total Work Order Closed', value: '12', color: 'blue' },
  { title: 'Total ERS Closed', value: '12', color: 'blue' },
  // { title: 'Total Service Request Open', value: '12', color: 'darkBlue' },

];
