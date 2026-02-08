import { create } from "zustand";

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
  // hydration lifecycle
  hydrated: boolean;
  setHydrated: () => void;

  // user session
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  clearUser: () => void;

  // location
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

export const useUserStore = create<AppStore>((set) => ({
  // hydration
  hydrated: false,
  setHydrated: () => set({ hydrated: true }),

  // user
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  // location
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
}));