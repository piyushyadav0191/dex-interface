"use client";

import React, { useState } from "react";
import { Token } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function TokenManager({
  tokens,
  onAddToken,
  onRemoveToken,
}: {
  tokens: Token[];
  onAddToken: (token: Token) => void;
  onRemoveToken: (symbol: string) => void;
}) {
  const [newTokenSymbol, setNewTokenSymbol] = useState("");
  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenAddress, setNewTokenAddress] = useState("");

  const handleAddToken = () => {
    if (newTokenSymbol && newTokenName && newTokenAddress) {
      const newToken: Token = {
        symbol: newTokenSymbol.toUpperCase(),
        name: newTokenName,
        address: newTokenAddress,
        decimals: 18, 
      };
      onAddToken(newToken);
     
      setNewTokenSymbol("");
      setNewTokenName("");
      setNewTokenAddress("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Input
          placeholder="Token Symbol"
          value={newTokenSymbol}
          onChange={(e) => setNewTokenSymbol(e.target.value)}
        />
        <Input
          placeholder="Token Name"
          value={newTokenName}
          onChange={(e) => setNewTokenName(e.target.value)}
        />
        <Input
          placeholder="Token Address"
          value={newTokenAddress}
          onChange={(e) => setNewTokenAddress(e.target.value)}
        />
      </div>
      <Button onClick={handleAddToken} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Token
      </Button>
      <div className="space-y-2">
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="flex justify-between items-center bg-muted p-2 rounded"
          >
            <span>
              {token.symbol} - {token.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveToken(token.symbol)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
