export type Address = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  alternate_phone: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

export const initialState: AddressState = {
  addresses: [],
  loading: true,
  error: null,
};

export type IndianState = {
  name: string;
  state_code: string;
};