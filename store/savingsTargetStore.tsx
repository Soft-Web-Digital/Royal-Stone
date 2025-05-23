import { SavingsTarget } from "@/types/Type";
import { create } from "zustand";
import { apiFetch } from "@/utils/apiHelper";

interface SavingsTargetStore {
  savingsTarget: SavingsTarget[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string;
  fetchSavingsTarget: (page?: number, forceRefresh?: boolean) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

export const useSavingsTargetStore = create<SavingsTargetStore>((set) => ({
  savingsTarget: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: "",

  fetchSavingsTarget: async (page = 1) => {
    try {
      // const token = localStorage.getItem("accessToken");
      const response = await apiFetch(`/savings/targets?page=${page}`, {
        method: "GET",
        headers: {
          // "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.status) {
        set({
          savingsTarget: data.data.data,
          currentPage: page,
          totalPages: data.data.totalPages,
        });
        
      } else {
        set({ error: "Failed to fetch data." });
      }
    } catch (error) {
      set({ error: "An error occurred while fetching data." });
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
  setCurrentPage: (page) => set({ currentPage: page }), // Update currentPage
}));
