import { create } from "zustand";

interface UserData {
  uid?: string;
  role?: "worker" | "employer";
  workStatus?: string;
  locationEnabled?: boolean;
  skillName?: string;
}

interface UserStore {
  userData: UserData | null;
  loading: boolean;
  setUserData: (data: UserData) => void;
  setWorkStatus: (status: string) => void;
  setLocationEnabled: (enabled: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  loading: true,
  setUserData: (data) => set({ userData: data, loading: false }),
  setWorkStatus: (status) =>
    set((state) => ({
      userData: { ...state.userData, workStatus: status },
    })),
  setLocationEnabled: (enabled) =>
    set((state) => ({
      userData: { ...state.userData, locationEnabled: enabled },
    })),
}));
