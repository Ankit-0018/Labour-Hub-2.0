import { error } from 'console';
import { create } from 'zustand'

type Location = {
    lng : number;
    lat : number;
}

type LocationStore = {
    location : Location | null;
    setLocation : (location : Location) => void;
    clearLocation : () => void;
    error : string | null;
    setError : (error : string) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  location: null,

  setLocation: (location) => set({ location }),

  clearLocation: () => set({ location: null }),
  
  error: null,
  setError: (error) => set({error})
}))