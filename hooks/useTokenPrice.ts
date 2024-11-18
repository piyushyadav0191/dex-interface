import { useState, useEffect } from "react";
import { Token } from "@/types";

export const useTokenPrice = (
  fromToken: Token,
  toToken: Token,
  amount: string
) => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceImpact, setPriceImpact] = useState(0);
  const [slippage, setSlippage] = useState(0);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setPrice(null);
        return;
      }

      try {
        setLoading(true);
        // mocking price calculation based on token pairs
        let basePrice;
        switch (`${fromToken.symbol}-${toToken.symbol}`) {
          case "ETH-USDC":
            basePrice = 1800;
            break;
          case "WBTC-USDC":
            basePrice = 45000;
            break;
          case "ETH-DAI":
            basePrice = 1805;
            break;
          default:
            basePrice = 1;
        }

        const amountNum = parseFloat(amount);
        const impact = amountNum > 10 ? 0.02 : amountNum > 5 ? 0.01 : 0.005;
        setPriceImpact(impact * 100);

        const estimatedSlippage = 0.005; // 0.5%
        setSlippage(estimatedSlippage * 100);

        const finalPrice = basePrice * (1 - impact);
        setPrice(finalPrice);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchPrice, 5000);
    fetchPrice();

    return () => clearInterval(interval);
  }, [fromToken, toToken, amount]);

  return { price, loading, error, priceImpact, slippage };
};
