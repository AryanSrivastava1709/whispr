import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const userStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      updateUserFriends: (friends) =>
        set((state) => ({
          ...state,
          user: {
            ...state.user,
            friends: friends,
          },
        })),
      fetchUser: async (userData) => {
        try {
          set({ isLoading: true });
          const res = await axios.post(
            "http://localhost:3000/api/users/login",
            userData
          );
          if (res.status === 200) {
            set({ user: res.data.user, isLoading: false });
          }
          Cookies.set("token", res.data.token);
        } catch (err) {
          if (err.response) {
            toast.error(err.response.data.message, {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            set({ user: null, isLoading: false });
          }
        }
      },
    }),
    {
      name: "user-storage",
    }
  )
);
