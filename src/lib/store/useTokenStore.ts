import { create } from 'zustand';
import { Token } from '@/lib/types/token';

interface TokenStore {
  selectedToken: Token | null;
  watchlist: string[];
  searchQuery: string;
  setSelectedToken: (token: Token | null) => void;
  addToWatchlist: (tokenId: string) => void;
  removeFromWatchlist: (tokenId: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useTokenStore = create<TokenStore>((set) => ({
  selectedToken: null,
  watchlist: [],
  searchQuery: '',

  setSelectedToken: (token) => set({ selectedToken: token }),

  addToWatchlist: (tokenId) =>
    set((state) => ({
      watchlist: state.watchlist.includes(tokenId)
        ? state.watchlist
        : [...state.watchlist, tokenId],
    })),

  removeFromWatchlist: (tokenId) =>
    set((state) => ({
      watchlist: state.watchlist.filter((id) => id !== tokenId),
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),
}));
