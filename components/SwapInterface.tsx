"use client";

import React, { useState, useEffect } from "react";
import { ArrowDownUp, Info, Settings } from "lucide-react";
import { TOKENS } from "@/constants/token";
import { useWeb3Store } from "@/store/web3Store";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { useTransaction } from "@/hooks/useTransaction";
import type { Token } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SwapInterface() {
  const { account, provider } = useWeb3Store();
  const [fromToken, setFromToken] = useState<Token>(TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {
    price,
    loading: priceLoading,
    priceImpact,
    slippage,
  } = useTokenPrice(fromToken, toToken, fromAmount);
  const { simulateTransaction, txState } = useTransaction();

  useEffect(() => {
    if (price && fromAmount) {
      const calculated = (parseFloat(fromAmount) * price).toFixed(6);
      setToAmount(calculated);
    } else {
      setToAmount("");
    }
  }, [price, fromAmount]);

  const handleSwap = async () => {
    if (!account) {
      alert("Please connect your wallet");
      return;
    }

    try {
      // Validate balance (mock check)
      const mockBalance = 100;
      if (parseFloat(fromAmount) > mockBalance) {
        throw new Error("Insufficient balance");
      }

      // Show confirmation modal
      setShowConfirmation(true);

      // Simulate transaction
      const txDetails = await simulateTransaction(
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        provider
      );

      // Handle successful simulation
      console.log("Transaction details:", txDetails);

      // In a real implementation, you would submit the transaction here
    } catch (error: any) {
      alert(`Swap failed: ${error.message}`);
    }
  };

  const handleTokenSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <Card className="w-full max-w-md mx-auto   text-card-foreground">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Swap</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swap settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <div className="flex space-x-2">
            <Select
              value={fromToken.symbol}
              onValueChange={(value) =>
                setFromToken(
                  TOKENS.find((t) => t.symbol === value) || TOKENS[0]
                )
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {TOKENS.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-grow"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" size="icon" onClick={handleTokenSwitch}>
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <div className="flex space-x-2">
            <Select
              value={toToken.symbol}
              onValueChange={(value) =>
                setToToken(TOKENS.find((t) => t.symbol === value) || TOKENS[1])
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {TOKENS.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-grow bg-muted"
            />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Slippage:</span>
            <span className={slippage > 1 ? "text-destructive" : ""}>
              {slippage.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Price Impact:</span>
            <span className={priceImpact > 2 ? "text-destructive" : ""}>
              {priceImpact.toFixed(2)}%
            </span>
          </div>
          {priceLoading && (
            <div className="text-center text-sm text-muted-foreground">
              Updating prices...
            </div>
          )}
        </div>

        {txState.status !== "idle" && (
          <div
            className={`text-sm text-center ${
              txState.status === "pending"
                ? "text-warning"
                : txState.status === "success"
                ? "text-success"
                : "text-destructive"
            }`}
          >
            {txState.status === "pending" && "Transaction pending..."}
            {txState.status === "success" && "Transaction successful!"}
            {txState.status === "failed" &&
              `Transaction failed: ${txState.error}`}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSwap}
          disabled={
            !account ||
            !fromAmount ||
            parseFloat(fromAmount) <= 0 ||
            txState.status === "pending"
          }
        >
          {!account
            ? "Connect Wallet"
            : txState.status === "pending"
            ? "Swapping..."
            : "Swap"}
        </Button>
      </CardFooter>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Swap</DialogTitle>
            <DialogDescription>
              Please review the details of your swap before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              From: {fromAmount} {fromToken.symbol}
            </p>
            <p>
              To: {toAmount} {toToken.symbol}
            </p>
            <p>Slippage: {slippage.toFixed(2)}%</p>
            <p>Price Impact: {priceImpact.toFixed(2)}%</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowConfirmation(false);
                // Additional confirmation logic would go here
              }}
            >
              Confirm Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
