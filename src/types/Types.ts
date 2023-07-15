export interface OrderItem {
  uuid: string;
  variationUuid: string;
  title: string;
  type: string;
  variationType: string;
  price: number;
  meta?: { quantity?: number; fields?: Array<any>; combine?: boolean };
}

export interface Cart {
  id: string;
  attributes: { title: string; total_price: { formatted: string } };
}
