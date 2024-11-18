"use client";

import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useOrderBook } from "@/hooks/useOrderBook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderBook() {
  const { orderBook, loading, error } = useOrderBook();

  const renderSkeletonTable = (title: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className={title === "Bids" ? "text-green-500" : "text-red-500"}
          >
            {title}
          </TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-4" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderDataTable = (
    data: Array<{ price: number; amount: number }>,
    title: string,
    ArrowIcon: typeof ArrowUp | typeof ArrowDown
  ) => (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead
            className={title === "Bids" ? "text-green-500" : "text-red-500"}
          >
            {title}
          </TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.slice(0, 5).map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <ArrowIcon
                className={`w-4 h-4 ${
                  title === "Bids" ? "text-green-500" : "text-red-500"
                }`}
              />
            </TableCell>
            <TableCell className="text-right">
              {item.price.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              {item.amount.toFixed(4)}
            </TableCell>
          </TableRow>
        ))}
        {[...Array(Math.max(0, 5 - data.length))].map((_, index) => (
          <TableRow key={`empty-${index}`}>
            <TableCell colSpan={3}>&nbsp;</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (error)
    return (
      <div className="text-center p-4 text-red-500" role="alert">
        Error: {error}
      </div>
    );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <>
              {renderSkeletonTable("Bids")}
              {renderSkeletonTable("Asks")}
            </>
          ) : (
            <>
              {renderDataTable(orderBook.bids, "Bids", ArrowUp)}
              {renderDataTable(orderBook.asks, "Asks", ArrowDown)}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
