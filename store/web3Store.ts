import {create} from "zustand";
import { ethers } from "ethers";
import { Web3State } from "@/types";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const useWeb3Store = create<Web3State>((set) => ({
  account: null,
  provider: null,
  loading: false,
  error: null,
  connectWallet: async () => {
    try {
      set({ loading: true });
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        set({ account: accounts[0], provider });
      } else {
        set({ error: "Please install MetaMask" });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));
