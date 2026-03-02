import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "worker" | "employer";

export type UserData = {
  uid: string;
  fullName: string;
  role: UserRole;
  workStatus?: string;
  skills?: string[];
  phone: number;
  email?: string;
  dailyWage: number;
  ratingCount: number;
  averageRating: number;
  completedJobsCount: number;
  totalEarnings: number;
  memberSince: string;
};

type Location = {
  lat: number;
  lng: number;
  address?: string;
  geohash?: string;
  city?: string;
};

type PermissionState = "granted" | "denied" | "prompt";

type AppStore = {
  hydrated: boolean;
  setHydrated: () => void;

  user: UserData | null;
  setUser: (user: UserData | null) => void;
  loading: boolean;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;

  location: Location | null;
  locationLoading: boolean;
  locationPermission: PermissionState;
  locationError: string | null;
  isTracking: boolean;

  setLocation: (location: Location) => void;
  clearLocation: () => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationPermission: (perm: PermissionState) => void;
  setLocationError: (error: string | null) => void;
  setTracking: (isTracking: boolean) => void;
};

export const useUserStore = create<AppStore>()(
  persist(
    (set) => ({
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      user: null,
      setUser: (user) => set({ user }),
      loading: true,
      setLoading: (loading) => {
        set({loading})
      },
      clearUser: () => set({ user: null, location: null }),

      location: null,
      locationLoading: false,
      locationPermission: "prompt",
      locationError: null,
      isTracking: false,

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
        setTracking: (isTracking) => set({isTracking: isTracking})
    }),
    {
      name: "labour-hub-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        location: state.location,
        locationPermission: state.locationPermission,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
