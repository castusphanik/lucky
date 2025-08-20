export interface CustomerInfo {
  billingAddress: string;
  contactInfo: string;
  taxId: string;
}

export interface EquipmentInfo {
  listOfUnitBuild: string;
  aliasas: string;
  locations: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billingPeriod: string;
  customer: CustomerInfo;
  equipment: EquipmentInfo;
  lineItems: LineItem[];
  subtotal: number;
  taxes: number;
  discounts: number;
  credits: number;
  totalAmountPaid: number;
  amountPaid: number;
  balanceDue: number;
}

export const invoiceData: InvoiceData = {
  invoiceNumber: 'TENX25433536',
  date: 'June 2, 2025',
  dueDate: 'July 30, 2025',
  billingPeriod: 'June 1, 2025 to July 31, 2025',
  customer: {
    billingAddress: '636 Greenwich St, New York.',
    contactInfo: 'deermail@gmail.com',
    taxId: 'TAXID-45645GE-56785'
  },
  equipment: {
    listOfUnitBuild: '432 Units',
    aliasas: 'Max Alias',
    locations: 'TAXID-45645GE-56785'
  },
  lineItems: [
    {
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      quantity: 24,
      rate: 15.0
    }
  ],
  subtotal: 360.0,
  taxes: 12.0,
  discounts: 0.0,
  credits: 12.0,
  totalAmountPaid: 320.0,
  amountPaid: 280.0,
  balanceDue: 40.0
};
