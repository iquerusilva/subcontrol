export interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  notes: string;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  customer_id: string;
  plan_id: string;
  start_date: string; // YYYY-MM-DD
  next_renewal: string; // YYYY-MM-DD
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
}

export interface Payment {
  id: string;
  subscription_id: string;
  amount: number;
  paid_at: string; // ISO Timestamp
}
