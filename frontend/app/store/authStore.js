import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getSession } from "@/lib/actions/auth";

const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        image: "",
        name: "",
        email: "",
        role: "",
        id : "",
        token: ""
      },
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      clearUser: () => {
        // Clear the state
        set({
          user: { image: "", name: "", email: "", role: "", id: "", token: "" },
          isAuthenticated: false
        });
        // Force remove from localStorage (though persist middleware should handle this)
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }
      },

      fetchSession: async () => {
        const session = await getSession();
        if (session && session.user) {
          set({
            user: session.user,
            isAuthenticated: true
          });
        } else {
          set({
            user: {id: "", image: "", name: "", email: "", role: "", token: "" },
            isAuthenticated: false,
          });
        }
      },

    }),
    {
      name: "auth-storage",
      storage: typeof window !== "undefined" ? localStorage : undefined,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;