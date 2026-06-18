// frontend/src/store/dataStore.js
import { create } from 'zustand';
import { collectorsAPI, collectionsAPI, recyclingAPI } from '../services/api';

export const useDataStore = create((set, get) => ({
  // Collections data
  collections: [],
  collectionsLoading: false,
  collectionsError: null,

  // Recycling data
  recyclingRecords: [],
  recyclingLoading: false,
  recyclingError: null,

  // Statistics
  collectionStats: null,
  recyclingStats: null,
  statsLoading: false,

  // Collector profile
  collectorProfile: null,
  profileLoading: false,

  // Fetch collections
  fetchCollections: async (params) => {
    set({ collectionsLoading: true, collectionsError: null });
    try {
      const response = await collectionsAPI.getAll(params);
      set({ collections: response.data, collectionsLoading: false });
    } catch (error) {
      set({
        collectionsError: error.message,
        collectionsLoading: false,
      });
    }
  },

  // Record collection
  recordCollection: async (data) => {
    try {
      const response = await collectionsAPI.record(data);
      set((state) => ({
        collections: [response.data, ...state.collections],
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch recycling records
  fetchRecyclingRecords: async (params) => {
    set({ recyclingLoading: true, recyclingError: null });
    try {
      const response = await recyclingAPI.getAll(params);
      set({ recyclingRecords: response.data, recyclingLoading: false });
    } catch (error) {
      set({
        recyclingError: error.message,
        recyclingLoading: false,
      });
    }
  },

  // Submit recycling record
  submitRecyclingRecord: async (data) => {
    try {
      const response = await recyclingAPI.submit(data);
      set((state) => ({
        recyclingRecords: [response.data, ...state.recyclingRecords],
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch statistics
  fetchStatistics: async () => {
    set({ statsLoading: true });
    try {
      const [collectionStats, recyclingStats] = await Promise.all([
        collectionsAPI.getStats(),
        recyclingAPI.getStats(),
      ]);
      set({
        collectionStats: collectionStats.data,
        recyclingStats: recyclingStats.data,
        statsLoading: false,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      set({ statsLoading: false });
    }
  },

  // Fetch collector profile
  fetchCollectorProfile: async (walletAddress) => {
    set({ profileLoading: true });
    try {
      const response = await collectorsAPI.getProfile(walletAddress);
      set({
        collectorProfile: response.data,
        profileLoading: false,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ profileLoading: false });
    }
  },
}));
