"use client";

import React, { useEffect } from "react";
import { Wallet } from "lucide-react";
import { useWeb3Store } from "@/store/web3Store";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const WalletConnect = () => {
  const { account, connectWallet, loading, error } = useWeb3Store();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div>
      {!account ? (
        <Button onClick={connectWallet} disabled={loading}>
          <Wallet className="w-4 h-4" />
          <span>{loading ? "Connecting..." : "Connect Wallet"}</span>
        </Button>
      ) : (
        <div className="text-sm px-4 py-2  text-white dark:text-white rounded-md ">
          {`${account.slice(0, 6)}...${account.slice(-4)}`}
        </div>
      )}
    </div>
  );
};
