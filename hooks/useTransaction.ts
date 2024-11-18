import { useState } from "react";
import { ethers } from "ethers";
import { Token } from "@/types";

interface TransactionState {
  status: "idle" | "pending" | "success" | "failed";
  error: string | null;
}

export const useTransaction = () => {
  const [txState, setTxState] = useState<TransactionState>({
    status: "idle",
    error: null,
  });

  const simulateTransaction = async (
    fromToken: Token,
    toToken: Token,
    fromAmount: string,
    toAmount: string,
    provider: any
  ) => {
    try {
      setTxState({ status: "pending", error: null });

      const gasPrice = await provider.getGasPrice();
      const estimatedGas = ethers.BigNumber.from("100000");
      const gasCost = gasPrice.mul(estimatedGas);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setTxState({ status: "success", error: null });

      return {
        gasPrice: ethers.utils.formatEther(gasPrice),
        estimatedGas: estimatedGas.toString(),
        totalGasCost: ethers.utils.formatEther(gasCost),
      };
    } catch (error: any) {
      setTxState({ status: "failed", error: error.message });
      throw error;
    }
  };

  return { simulateTransaction, txState };
};
