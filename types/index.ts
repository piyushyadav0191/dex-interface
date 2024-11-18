export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
}

export interface Order {
  price: number;
  amount: number;
}

export interface OrderBook {
  bids: Order[];
  asks: Order[];
}

export interface Web3State {
  account: string | null;
  provider: any;
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
}
