// frontend/src/store/authStore.js
import { create } from 'zustand';
import web3Service from '../services/web3Service';

export const useAuthStore = create((set) => ({
  account: null,
  isConnected: false,
  balance: '0',
  isLoading: false,
  error: null,

  connectWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const { account } = await web3Service.initializeWeb3();
      const balance = await web3Service.getBalance();

      set({
        account,
        isConnected: true,
        balance,
        isLoading: false,
      });

      // Watch for changes
      web3Service.onAccountChange((newAccount) => {
        set({ account: newAccount });
      });

      return account;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  disconnectWallet: () => {
    set({
      account: null,
      isConnected: false,
      balance: '0',
    });
  },

  updateBalance: async () => {
    try {
      const balance = await web3Service.getBalance();
      set({ balance });
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
