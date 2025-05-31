//Esto lo saque de la docu así quq que chingue a su madre
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/general";

type Store = {
  user: User | null;
  setUser: (newUser: User | null) => void;
};

export const useStore = create<Store>()(
  //Esto es pa almacenar en el locale
  persist(
    (set) => ({
      user: null,
      setUser: (newUser) => set({ user: newUser }),
    }),
    {
      name: "userInLocaleStorage",
      //Esta vaina te dice que se va a guardar en el locale storage
      partialize: (state) => ({ user: state.user }),
    }
  )
);
