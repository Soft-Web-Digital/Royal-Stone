import { create } from "zustand";
import { apiFetch } from "@/utils/apiHelper";

interface Product {
  id: string;
  name: string;
  description: string;
  totalUnits: number;
  location: string;
  availableUnits: number;
  costPerUnit: number;
  ROI: { value: number; duration: number };
  images: string[];
  link: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductStore {
  products: Product[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  fetchProducts: (page? : number, forceRefresh? : boolean) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  fetchProducts: async (page = 1) => {
   
   
    set({ isLoading: true, error: null }); // Start loading
    try {
      const response = await apiFetch(
         `/products?page=${page}`
      ); // Always fetch from page 1 initially
      const data = await response.json();
      if (data.status) {
        set({
          products: data.data.data,
          currentPage: page,
          totalPages: data.data.totalPages,
        });
      } else {
        set({ error: "Failed to fetch data." });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred.";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false }); // Loading complete
    }
  },
  setCurrentPage: (page) => set({ currentPage: page }), // Update currentPage
}));

export default useProductStore;
