import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserRole = "worker" | "employer";

type UserData = {
  uid: string;
  role: UserRole;
  workStatus?: string;
  skillName?: string;
};

type Location = {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
};

type PermissionState = "granted" | "denied" | "prompt";

type AppStore = {
  hydrated: boolean;
  setHydrated: () => void;

  user: UserData | null;
  setUser: (user: UserData | null) => void;
  clearUser: () => void;

  location: Location | null;
  locationLoading: boolean;
  locationPermission: PermissionState;
  locationError: string | null;

  setLocation: (location: Location) => void;
  clearLocation: () => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationPermission: (perm: PermissionState) => void;
  setLocationError: (error: string | null) => void;
};

export const useUserStore = create<AppStore>()(
  persist(
    (set) => ({
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null, location: null }),

      location: null,
      locationLoading: false,
      locationPermission: "prompt",
      locationError: null,

      setLocation: (location) =>
        set({
          location,
          locationLoading: false,
          locationError: null,
        }),

      clearLocation: () => set({ location: null }),

      setLocationLoading: (loading) => set({ locationLoading: loading }),
      setLocationPermission: (perm) => set({ locationPermission: perm }),
      setLocationError: (error) =>
        set({
          locationError: error,
          locationLoading: false,
        }),
    }),
    {
      name: "labour-hub-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        location: state.location,
        locationPermission: state.locationPermission,
      }),
      onRehydrateStorage: () => (state) => {
        // Automatically set hydrated to true when rehydration completes
        state?.setHydrated();
      },
    }
  )
);
