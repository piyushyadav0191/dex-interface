import { OrderBook } from "@/components/OrderBook";
import { SwapInterface } from "@/components/SwapInterface";
import { ModeToggle } from "@/components/theme-toggle";
import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
  return (
    <div className=" bg-background">
      <header className="p-4 border-b border-gray-700  bg-gray-900">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            DEX Swap
          </h1>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <WalletConnect />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl shadow-lg border-4 border-gray-700 backdrop-blur-md transition-colors">
            <SwapInterface />
          </div>
          <div className="p-6 rounded-xl shadow-lg border-4 border-gray-700 backdrop-blur-md transition-colors">
            <OrderBook />
          </div>
        </div>
      </main>
    </div>
  );
}
