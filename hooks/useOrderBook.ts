import { useState, useEffect } from "react";
import { OrderBook } from "@/types";

export const useOrderBook = () => {
  const [orderBook, setOrderBook] = useState<OrderBook>({ bids: [], asks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRandomChange = (base: number) => {
    return base + (Math.random() - 0.5) * 0.5; // Change within ±0.25
  };

  const generateOrderBookData = () => {
    return {
      bids: Array.from({ length: 5 }, (_, i) => ({
        price: generateRandomChange(1800 - i * 0.25),
        amount: generateRandomChange(2 + Math.random()),
      })),
      asks: Array.from({ length: 5 }, (_, i) => ({
        price: generateRandomChange(1801 + i * 0.25),
        amount: generateRandomChange(2 + Math.random()),
      })),
    };
  };

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        setLoading(true);
        // Generate dynamic mock data
        setOrderBook(generateOrderBookData());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchOrderBook, 2000);
    return () => clearInterval(interval);
  }, []);

  return { orderBook, loading, error };
};
